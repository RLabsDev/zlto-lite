import { FunctionalComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useStore } from '../../store';
import get from '../../utils/get';
import ProductCard from './ProductCard';
import style from './style.scss';

const ZLTO_API = 'https://api.zlto.co';

const Store: FunctionalComponent = () => {
    const [token] = useStore.token();
    const [products, setProducts] = useStore.stores();
    console.log('@@@@@  ~ file: index.tsx ~ line 12 ~ products', products)

    useEffect(() => {
        getStoreItems();
      }, []);

    async function getStoreItems() {
        const res = await fetch(`${ZLTO_API}/store/stores`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });

        console.log('@@@ res: ', res);

        if (!!res) {
            const data = await res.json();
            console.log('@@@@@  ~ file: index.tsx ~ line 29 ~ session ~ data', data)

            const validStores = (data || []).filter(obj => obj.available_products?.store_items !== []);
            console.log('@@@@@  ~ file: index.tsx ~ line 32 ~ getStoreItems ~ validStores', validStores)

            const products = validStores.flatMap(store => get(store, 'available_products.store_items', []));

            setProducts(products);
        }
    };

    // async function getDetails() {
    //     const res = await fetch(`${ZLTO_API}/earn/survey/${survey.id}/`, {
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${token}`,
    //         }
    //     });

    //     console.log('@@@ getSurveyDetails res: ', res);

    //     if (!!res) {
    //         const data = await res.json();
    //         console.log('@@@@@  ~ file: index.tsx ~ line 29 ~ session ~ data', data)

    //         setSurveyInFocus(data);
    //     } 
    // };

    return (
        <div class={style.home}>
            <h1 class={style.title}>Select your prize 🎁</h1>
            {!!products &&
                <div class={style.grid}>
                    {products.map(product => (
                        <ProductCard product={product} />
                    ))}
                </div>
            }
        </div>
    );
};

export default Store;
