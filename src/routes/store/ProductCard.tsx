import { h } from "preact";
import style from './style.scss';
import get from '../../utils/get';


const ProductCard = ({ product }) => {

  return (
    <label class={style.card}>
      <input name="product" class={style.radio} type="radio"/>
      <span class={style.product_details} aria-hidden="true">
        <span class={style.product_name}>{get(product, 'name', '')}</span>
        <span class={style.product_cost}>{get(product, 'amount', '')} <span class={style.zlto}>ZLTO</span></span>
        <span>{get(product, 'description', '')}</span>
      </span>
    </label>
  );
};

export default ProductCard;
