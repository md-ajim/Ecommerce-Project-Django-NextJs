import Link from "next/link";

import Products from "../../components/product/product category/Products";

import SearchResult from "../../components/search/searchProduct";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const { query } = context;
  const searchQuery = query.q || "";
  const category = query.category || "";
  const colorFilter = query.color || "";
  const sizeFilter = query.size || "";
  const price = query.price || "";
  const minPrice = query.min_price || "";
  const maxPrice = query.max_price || "";
  const ordering = query.ordering || "";

  const res = await fetch(
    `http://127.0.0.1:8000/api/products/?categories__category_name=${category}&product_details__color=${colorFilter}&product_details__size=${sizeFilter}&price=${price}&min_price=${minPrice}&max_price=${maxPrice}&ordering=${ordering}`
  );
  const products = await res.json();

  return {
    props: { products },
  };
}

export default function ProductAll({ products }) {
  const router = useRouter();
  const [category, setCategory] = useState(""); // Store the current category
  const [search, setSearch] = useState([]);
  const [searchResults, setSearchResults] = useState(false);
  const [sorts, setSorts] = useState("");
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");
  const [prices, setPrices] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ordering, setOrdering] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [all, setAll] = useState("");
  const [allBoolean, setAllBoolean] = useState(false);
  const { q, color, size, min_price, max_price, price, sort } = router.query;

  const [product, setProduct] = useState([]);

  const [categories, setCategories] = useState(false);

  // Fetch products based on the query
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/products/?search=${q}`
        );
        const data = await res.json();
        setSearch(data?.results);
        setAllBoolean(false);
        setSearchResults(data?.results?.length > 0);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchProductsAll = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/products/?categories__category_name=${category}&product_details__color=${colorFilter}&product_details__size=${sizes}&price=${prices}&min_price=${minPrice}&max_price=${maxPrice}&ordering=${ordering}`
        );
        const data = await res.json();
        setAllProducts(data?.results);
        //  setAllBoolean(data.results.length > 0);
      } catch (error) {
        console.error(error);
      }
    };

    if (allBoolean) {
      fetchProductsAll();
    }

    //  fetchProductsAll()
    fetchProducts();

    if (q) {
      setCategory(q); // Update the category state based on the query
    }
  }, [q, color, size, min_price, max_price, price, ordering, sort]);

  // Function to handle category clicks and set the category
  const handleCategoryClick = (category) => {
    setAllBoolean(false);
    setCategory(category);
    // router.push(`/search?q=${category}`); // Update the URL with the category
    router.push(`?category=${category}`);
  };

  const handleColorChange = (e) => {
    setColors(e.target.value);
    router.push(
      `?category=${category}&color=${e.target.value}&size=${sizes}&price=${prices}`
    );
  };

  const handleSizeChange = (e) => {
    setSizes(e.target.value);
    router.push(
      `?category=${category}&color=${colors}&size=${e.target.value}&price=${prices}`
    );
  };

  const handlePriceChange = (e) => {
    setPrices(e.target.value);
    router.push(
      `?category=${category}&color=${colors}&size=${sizes}&price=${e.target.value}`
    );
  };

  // const handleMinPriceChange = (e) => {
  //   setMinPrice(e.target.value);
  //   router.push(`?category=${category}&color=${colors}&size=${sizes}&min_price=${e.target.value}`);
  // };

  // const handleMaxPriceChange = (e) => {
  //   setMaxPrice(e.target.value);
  //   router.push(`?category=${category}&color=${colors}&size=${sizes}&min_price=${minPrice}&max_price=${e.target.value}`);
  // };

  // const handleOrderingChange = (e) => {
  //   setOrdering(e.target.value);
  //   router.push(`?category=${category}&color=${colors}&size=${sizes}&min_price=${minPrice}&max_price=${maxPrice}&ordering=${e.target.value}`);
  // };

  const handleSortChange = (e) => {
    console.log(e.target.value, "e.target.value,");
    setAllBoolean(false);
    setSorts(e.target.value);

    router.push(
      `?category=${category}&color=${colors}&size=${sizes}&price=${prices}&min_price=${minPrice}&max_price=${maxPrice}&ordering=${e.target.value}`
    );
  };

  const handleAllClick = async (e) => {
    setAllBoolean(true);
    setColors("");
    setSizes("");
    setCategory("");
    setAll(e);
    router.push(`?product=${e}`);
  };

  const COLOR_CHOICES = [
    { value: "Black", label: "Black" },
    { value: "White", label: "White" },
    { value: "Red", label: "Red" },
    { value: "Blue", label: "Blue" },
    { value: "Green", label: "Green" },
    { value: "Yellow", label: "Yellow" },
    { value: "Orange", label: "Orange" },
    { value: "Purple", label: "Purple" },
    { value: "Pink", label: "Pink" },
    { value: "Gray", label: "Gray" },
    { value: "Brown", label: "Brown" },
    { value: "Cyan", label: "Cyan" },
    { value: "Magenta", label: "Magenta" },
    { value: "Maroon", label: "Maroon" },
    { value: "Navy", label: "Navy" },
    { value: "Olive", label: "Olive" },
    { value: "Teal", label: "Teal" },
    { value: "Lime", label: "Lime" },
    { value: "Beige", label: "Beige" },
    { value: "Gold", label: "Gold" },
    { value: "Silver", label: "Silver" },
    { value: "Violet", label: "Violet" },
    { value: "Indigo", label: "Indigo" },
    { value: "Turquoise", label: "Turquoise" },
    { value: "Lavender", label: "Lavender" },
    { value: "Crimson", label: "Crimson" },
    { value: "Coral", label: "Coral" },
    { value: "Peach", label: "Peach" },
    { value: "Mint", label: "Mint" },
    { value: "Ivory", label: "Ivory" },
    { value: "Charcoal", label: "Charcoal" },
    { value: "Burgundy", label: "Burgundy" },
    { value: "Rose", label: "Rose" },
    { value: "Emerald", label: "Emerald" },
    { value: "Saffron", label: "Saffron" },
    { value: "Azure", label: "Azure" },
  ];

  return (
    <section className=" dark:bg-black/90 bg-white py-4 dark:text-white" >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
          {/* Sidebar */}
          <div className="md:pt-4">
            <div className="hidden md:block">
              <span className="text-sm text-gray-500">Collections</span>
              <ul className="mb-4">
                <li
                  className="cursor-pointer hover:underline hover:text-indigo-600"
                  onClick={() => handleAllClick("all")}
                >
                  All
                </li>

                <li
                  className="cursor-pointer hover:underline hover:text-indigo-600"
                  onClick={() => handleCategoryClick("Accessories")}
                >
                  Accessories
                </li>

                <li
                  className="cursor-pointer hover:underline hover:text-indigo-600"
                  onClick={() => handleCategoryClick("Bags")}
                >
                  Bags
                </li>
                <li
                  className="cursor-pointer hover:underline hover:text-indigo-600"
                  onClick={() => handleCategoryClick("T-Shirt")}
                >
                  T-Shirt
                </li>
                {/* <li
                  className="cursor-pointer hover:underline hover:text-indigo-600"
                  onClick={() => handleCategoryClick("Electronics")}
                >
                  Electronics
                </li> */}
                <li
                  className="cursor-pointer hover:underline hover:text-indigo-600"
                  onClick={() => handleCategoryClick("Footwear")}
                >
                  Footwear
                </li>
                <li
                  className="cursor-pointer hover:underline hover:text-indigo-600"
                  onClick={() => handleCategoryClick("Headwear")}
                >
                  Headwear
                </li>
                <li
                  className="cursor-pointer hover:underline hover:text-indigo-600"
                  onClick={() => handleCategoryClick("Hoodies")}
                >
                  Hoodies
                </li>

                <li
                  className="cursor-pointer hover:underline hover:text-indigo-600"
                  onClick={() => handleCategoryClick("Shoes")}
                >
                  Shoes
                </li>
              </ul>

              <select
                onChange={handleColorChange}
                className="select select-accent bg-transparent bg-gray-200 dark:bg-black   dark:text-white text-black mb-4 select-sm w-full max-w-xs"
              >
                <option disabled selected className="dark:bg-black text-black  dark:text-white bg-gray-200">
                  Select a color
                </option>
                {COLOR_CHOICES.map((color) => (
                  <option
                    key={color.value}
                    value={color.value}
                    className=" bg-gray-200 text-black dark:text-white dark:bg-black"
                  >
                    {color.label}
                  </option>
                ))}
              </select>

              <select
                onChange={handleSizeChange}
                className="select select-accent bg-transparent bg-gray-200 dark:bg-black   dark:text-white text-black mb-4 select-sm w-full max-w-xs"
              >
                <option className="bg-gray-200 text-black dark:text-white dark:bg-black" disabled selected>
                  Select an size{" "}
                </option>
                <option value="XS">Extra Small</option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
                <option value="XL">Extra Large</option>
                <option value="XXL"> Double Extra Large</option>
                <option value="XXXL">Triple Extra Large</option>
              </select>
            </div>
            {/* Mobile Filters */}
            <div className=" md:hidden w-full">
              <select
                className="p-2 border w-full mb-4  dark:bg-black rounded focus:outline-none"
                onChange={(e) => handleCategoryClick(e.target.value)}
              >
                <option value="">All</option>
                <option value="Bags">Bags</option>
                <option value="T-Shirt">T-Shirt</option>
                <option value="Electronics">Electronics</option>
                <option value="Footwear">Footwear</option>
                <option value="Headwear">Headwear</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
                <option value="Shoes">Shoes</option>
              </select>
              <select
                className="p-2 border w-full mb-4 dark:bg-black rounded focus:outline-none"
                onChange={handleSortChange}
              >
                <option value="relevance">Relevance</option>
                <option value="popularity">Popularity</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
              </select>
              <select
                className="p-2 border w-full mb-4 dark:bg-black rounded focus:outline-none"
                onChange={handleColorChange}
              >
                <option disabled selected className="dark:bg-black">
                  Select a color
                </option>
                {COLOR_CHOICES.map((color) => (
                  <option
                    key={color.value}
                    value={color.value}
                    className="dark:bg-black"
                  >
                    {color.label}
                  </option>
                ))}
              </select>
              <select
                className="p-2 border w-full mb-4 dark:bg-black rounded focus:outline-none"
                onChange={handleSizeChange}
              >
                <option value="">Size</option>
                <option value="XS">Extra Small</option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
                <option value="XL">Extra Large</option>
                <option value="XXL">Double Extra Large</option>
                <option value="XXXL">Triple Extra Large</option>
              </select>
            </div>
          </div>

          {/* Product Display */}
          <div className="md:col-span-6 rounded-lg ">
            {searchResults ? (
              <SearchResult searchData={search} />
            ) : (
              <Products products={products?.results} />
            )}
          </div>

          <div className="hidden md:block md:pt-4">
            <span className="text-sm text-gray-500">Sort by</span>
            <ul className="mb-4">
              <li
                conClick={() => {
                  () => handleSortChange("relevance");
                }}
                className="hover:underline hover:text-indigo-600 cursor-pointer"
              >
                <Link href="?ordering=relevance">Relevance</Link>
              </li>
              <li
                conClick={() => {
                  () => handleSortChange("popularity");
                }}
                className="hover:underline hover:text-indigo-600 cursor-pointer"
              >
                <Link href="?ordering=popularity">Trending</Link>
              </li>
              <li
                conClick={() => {
                  () => handleSortChange("newest");
                }}
                className="hover:underline hover:text-indigo-600 cursor-pointer"
              >
                <Link href="?ordering=newest">Latest arrivals</Link>
              </li>
              <li
                conClick={() => {
                  () => handleSortChange("price");
                }}
                className="hover:underline hover:text-indigo-600 cursor-pointer"
              >
                <Link href="?ordering=price">Price: Low to High</Link>
              </li>
              <li
                conClick={() => {
                  () => handleSortChange("-price");
                }}
                className="hover:underline hover:text-indigo-600 cursor-pointer"
              >
                <Link href="?ordering=-price">Price: High to Low</Link>
              </li>
            </ul>

            <label
              for="number-input"
              class="block mb-1 text-sm font-medium  text-black dark:text-white"
            >
              {" "}
              Price Range{" "}
            </label>
            <input
              onChange={handlePriceChange}
              value={prices}
              min="0"
              max="1000"
              class="shadow appearance-none border rounded w-full  py-2 dark:bg-black dark:text-white text-black  px-3  leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              id="number-input"
              placeholder="0-1000"
              required
            />
          </div>
        </div>
      </div>
    </section>
  );
}
