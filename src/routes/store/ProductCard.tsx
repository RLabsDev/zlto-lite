import { h } from "preact";
import style from './style.scss';
import get from '../../utils/get';
import { useStore } from '../../store';
import { useEffect, useState } from "preact/hooks";

const ZLTO_API = 'https://api.zlto.co';

const ProductCard = ({ product, onProductClicked }) => {
  const [token, setToken] = useStore.token();

  return (
    <label class={style.card} onClick={() => onProductClicked(product)}>
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
