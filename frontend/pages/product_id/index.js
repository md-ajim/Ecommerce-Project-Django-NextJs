import AcmeGeometricCirclesTShirt from "../../components/product/acme-geometric-circles-t-shirt";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const AcmeGeometricCirclesTShirtPage = (props) => {
  const router = useRouter();
  const { id, q } = router.query;
  const [product, setProduct] = useState([]);
  const [productsDetails, setProductsDetails] = useState({});
  const [colorAndSize, setColorAndSize] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
    
        const res = await fetch(`http://127.0.0.1:8000/api/products/${id}/`);
        const data = await res.json();
        setProduct(data);
        const productDetails = data.product_details[0];
        setProductsDetails(productDetails);
        setColorAndSize(productDetails?.colors[0].color);
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
  
      fetchProducts();
    }
  }, [id, q ,] );
  console.log(colorAndSize, 'colorAndSize_main')

  return (
    <AcmeGeometricCirclesTShirt
      product={product}
      productsDetails={productsDetails}
      colorAndSize={colorAndSize} // Passing color and size as props
    />
  );
};

export default AcmeGeometricCirclesTShirtPage;
