import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../../context/CartContext";
import { db } from "../../../firebaseConfig";
import { getDoc, collection, doc } from "firebase/firestore";
import ProductDetail from "./ProductDetail";
import NavigateToTop from "../../../routes/NavigateToTop";
import SuccessModal from "../../modals/successModal/SuccessModal";

export default function ProductDetailContainer() {
  // Desestructurar funciones del contexto CartContext para gestionar el carrito
  const { addToCart, getQuantityById } = useContext(CartContext);

  // Obtener el ID del producto de los parámetros de la ruta
  const { id } = useParams();

  // Obtener la cantidad total de productos en el carrito utilizando el ID del producto
  const totalQuantity = getQuantityById(id);

  // Estado para almacenar el producto seleccionado
  const [selectedProduct, setSelectedProduct] = useState([]);

  // Estado para controlar la visibilidad del modal de éxito
  const [successModal, setSuccessModal] = useState(false);

  useEffect(() => {
    // Referencia a la colección "products" en Firestore
    const productsCollection = collection(db, "products");

    // Referencia al documento específico del producto utilizando su ID
    const selectedDoc = doc(productsCollection, id);

    // Obtener los datos del documento y actualizar el estado del producto seleccionado
    getDoc(selectedDoc).then((response) => {
      setSelectedProduct({ ...response.data(), id: response.id });
    });
  }, [id]);

  // Función que se ejecuta al agregar el producto al carrito
  const onAdd = (quantity) => {
    // Crear un objeto que represente el producto con la cantidad seleccionada
    const productCart = { ...selectedProduct, quantity };

    // Llamar a la función addToCart del contexto para agregar el producto al carrito
    addToCart(productCart);

    // Mostrar el modal de éxito al agregar el producto
    setSuccessModal(true);
  };

  return (
    <>
      {/* Metadata title */}
      <Helmet>
        <title>
          {selectedProduct.title
            ? `${selectedProduct.title} - FrontLibros`
            : "Cargando el producto"}
        </title>
      </Helmet>

      <NavigateToTop />

      <ProductDetail
        selectedProduct={selectedProduct}
        stock={selectedProduct.stock}
        onAdd={onAdd}
        totalQuantity={totalQuantity}
      />

      {successModal && (
        <SuccessModal
          title="Producto Agregado"
          message="Revisa el carrito"
          onConfirm={() => setSuccessModal(false)}
        />
      )}
    </>
  );
}
