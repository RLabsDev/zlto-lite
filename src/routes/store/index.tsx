import { FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useStore } from "../../store";
import ProductCard from "./ProductCard";
import style from "./style.scss";

const ZLTO_API = "https://api.zlto.co";

const Store: FunctionalComponent = () => {
  const [token] = useStore.token();
  const [products, setProducts] = useStore.stores();
  const [zltoBalance, setZltoBalance] = useStore.zltoBalance();

  console.log("@@@@@  ~ file: index.tsx ~ line 12 ~ products", products);

  const [selectedProduct, setSelectedProduct] = useState({} as any);

  useEffect(() => {
    getStoreItems();
  }, []);

  async function getStoreItems() {
    const res = await fetch(`${ZLTO_API}/dl_get_stores/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    console.log("@@@ res: ", res);

    if (!!res) {
      const stores = await res.json();
      console.log(
        "@@@@@  ~ file: index.tsx ~ line 29 ~ session ~ stores",
        stores
      );

      // const validStores = (data || []).filter(obj => obj.available_products?.store_items !== []);
      // console.log('@@@@@  ~ file: index.tsx ~ line 32 ~ getStoreItems ~ validStores', validStores)

      // const products = validStores.flatMap(store => get(store, 'available_products.store_items', []));

      const products = await Promise.all(
        stores.map(async (store) => {
          const res = await fetch(
            `${ZLTO_API}/dl_get_store_items/${store.id}/`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
              },
            }
          );

          console.log("@@@ res: ", res);

          const products = await res.json();
          console.log(
            "@@@@@  ~ file: index.tsx ~ line 55 ~ getStoreItems ~ products",
            products
          );
          return products;
        })
      );
      console.log(
        "@@@@@  ~ file: index.tsx ~ line 59 ~ getStoreItems ~ products",
        products
      );

      const productsAvailable = products
        .flat()
        .filter((obj) => obj.stock_level_left > 0);
      console.log(
        "@@@@@  ~ file: index.tsx ~ line 61 ~ getStoreItems ~ productsAvailable",
        productsAvailable
      );

      setProducts(productsAvailable as any);
    }
  }

  async function onPurchase() {
    if (
      !!selectedProduct.id &&
      confirm(
        `Purchase ${selectedProduct?.name} for ${selectedProduct.amount} ZLTO?`
      )
    ) {
      const res = await fetch(
        `${ZLTO_API}/dl_make_store_purchase/${selectedProduct?.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log(
        "@@@@@  ~ file: ProductCard.tsx ~ line 43 ~ onClick ~ res",
        res
      );

      const data = await res.json();
      console.log(
        "@@@@@  ~ file: ProductCard.tsx ~ line 48 ~ onClick ~ data",
        data
      );

      if (data.status === "Item successfully purchased.") {
        window.alert(
          `Purchase successful! The voucher has been sent to your email. Current balance: ${data?.bank_account?.balance_amount}`
        );

        const getAccountRes = await fetch(`${ZLTO_API}/dl_account_details/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
        const accountData = await getAccountRes.json();
        console.log(
          "@@@@@  ~ file: index.tsx ~ line 42 ~ performAuth ~ accountData",
          accountData
        );

        setZltoBalance(accountData.balance);
      } else {
        if (data.status === "User cannot afford this") {
          window.alert(
            "You cannot afford this at the moment. Keep earning Zlto and come back soon!"
          );
        } else {
          window.alert(data.status);
        }
      }
    }
  }

  return (
    <div class={style.home}>
      <h1 class={style.title}>Select an item to purchase 🎁</h1>
      <div class={style.redeem_button_container}>
        {!selectedProduct.id ? (
          <button class={style.redeem_button} disabled>
            Purchase
          </button>
        ) : (
          <button class={style.redeem_button} onClick={onPurchase}>
            Purchase
          </button>
        )}
      </div>
      {!!products && (
        <div class={style.grid}>
          {products.map((product) => (
            <ProductCard
              product={product}
              onProductClicked={(product) => setSelectedProduct(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Store;
