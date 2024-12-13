import Link from "next/link";
import Bags from "@/components/product/product category/Bags";
import Drinkwater from "@/components/product/product category/Products";
import Electronics from "@/components/product/product category/Electronics";
import Footware from "@/components/product/product category/Footware";
import Headwear from "@/components/product/product category/Headwear";
import All from "@/components/product/product category/all";
import Shoes from "@/components/product/product category/Shoes";
import Clothing from "@/components/product/product category/Clothing";
import Accessories from "@/components/product/product category/Accessories";

import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";

import { useRouter } from "next/router";
export default function Accessories() {
  const router = useRouter();

  const [isAll, setIsAll] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isBags, setIsBags] = useState(false);
  const [isDrinkwater, setIsDrinkwater] = useState(false);
  const [isElectronics, setIsElectronics] = useState(false);
  const [isFootware, setIsFootware] = useState(false);
  const [isHeadwear, setIsHeadwear] = useState(false);
  const [isShoes, setIsShoes] = useState(false);
  const [isClothing, setIsClothing] = useState(false);
  const [isAccessories, setIsAccessories] = useState(false);

  const toggleAll = () => {
    setIsAll(!isAll);
    setIsBags(false);
    setIsDrinkwater(false);
    setIsElectronics(false);
    setIsFootware(false);
    setIsHeadwear(false);
    setIsShoes(false);
    setIsClothing(false);
    setIsAccessories(false);
  };

  const toggleBags = () => {
    setIsBags(!isBags);
    setIsAll(false);
    setIsDrinkwater(false);
    setIsElectronics(false);
    setIsFootware(false);
    setIsHeadwear(false);
    setIsShoes(false);
    setIsClothing(false);
    setIsAccessories(false);
  };
  const toggleDrinkwater = () => {
    setIsDrinkwater(!isDrinkwater);
    setIsAll(false);
    setIsBags(false);
    setIsElectronics(false);
    setIsFootware(false);
    setIsHeadwear(false);
    setIsShoes(false);
    setIsClothing(false);
    setIsAccessories(false);
  };
  const toggleElectronics = () => {
    setIsElectronics(!isElectronics);
    setIsAll(false);
    setIsBags(false);
    setIsDrinkwater(false);
    setIsFootware(false);
    setIsHeadwear(false);
    setIsShoes(false);
    setIsClothing(false);
    setIsAccessories(false);
  };
  const toggleFootware = () => {
    setIsFootware(!isFootware);
    setIsAll(false);
    setIsBags(false);
    setIsDrinkwater(false);
    setIsElectronics(false);
    setIsHeadwear(false);
    setIsShoes(false);
    setIsClothing(false);
    setIsAccessories(false);
  };
  const toggleHeadwear = () => {
    setIsHeadwear(!isHeadwear);
    setIsAll(false);
    setIsBags(false);
    setIsDrinkwater(false);
    setIsElectronics(false);
    setIsFootware(false);
    setIsShoes(false);
    setIsClothing(false);
    setIsAccessories(false);
  };

  const toggleShoes = () => {
    setIsShoes(!isShoes);
    setIsAll(false);
    setIsBags(false);
    setIsDrinkwater(false);
    setIsElectronics(false);
    setIsFootware(false);
    setIsHeadwear(false);
    setIsClothing(false);
    setIsAccessories(false);
  };
  const toggleClothing = () => {
    setIsClothing(!isClothing);
    setIsAll(false);
    setIsBags(false);
    setIsDrinkwater(false);
    setIsElectronics(false);
    setIsFootware(false);
    setIsHeadwear(false);
    setIsShoes(false);
    setIsAccessories(false);
  };
  const toggleAccessories = () => {
    setIsAccessories(!isAccessories);
    setIsAll(false);
    setIsBags(false);
    setIsDrinkwater(false);
    setIsElectronics(false);
    setIsFootware(false);
    setIsHeadwear(false);
    setIsShoes(false);
    setIsClothing(false);
  };

  return (
    <section>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
          <div className="">
            <div>
              <span className="text-sm  text-gray-500 ">Collections</span>

              <ul>
                <li
                  className="cursor-pointer hover:underline hover:text-indigo-600"
                  onClick={() => toggleAll()}
                >
                  <Link href="all">All</Link>
                </li>
                <li
                  className="cursor-pointer hover:underline hover:text-indigo-600"
                  onClick={() => toggleBags()}
                >
                  <Link href="bags">Bags</Link>
                </li>
                <li
                  className="cursor-pointer hover:underline hover:text-indigo-600"
                  onClick={() => toggleDrinkwater()}
                >
                  <Link href="drinkwater">Drinkwater</Link>
                </li>
                <li
                  className="cursor-pointer hover:underline hover:text-indigo-600"
                  onClick={() => toggleElectronics()}
                >
                  <Link href="electronics">Electronics</Link>
                </li>
                <li
                  className="cursor-pointer hover:underline hover:text-indigo-600"
                  onClick={() => toggleFootware()}
                >
                  <Link href="footware">Footware</Link>
                </li>
                <li
                  className="cursor-pointer hover:underline hover:text-indigo-600"
                  onClick={() => toggleHeadwear()}
                >
                  <Link href="headwear">Headwear</Link>
                </li>
                <li
                  className="cursor-pointer hover:underline hover:text-indigo-600"
                  onClick={() => toggleClothing()}
                >
                  <Link href="clothing">Clothing</Link>
                </li>
                <li
                  className="cursor-pointer hover:underline hover:text-indigo-600"
                  onClick={() => toggleAccessories()}
                >
                  <Link href="accessories">Accessories</Link>
                </li>
                <li
                  className="cursor-pointer hover:underline hover:text-indigo-600"
                  onClick={() => toggleShoes()}
                >
                  <Link href="shoes">Shoes</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="md:col-span-6 rounded-lg ">
            {isAll ? (
              <All />
            ) : isBags ? (
              <Bags />
            ) : isDrinkwater ? (
              <Drinkwater />
            ) : isElectronics ? (
              <Electronics />
            ) : isFootware ? (
              <Footware />
            ) : isHeadwear ? (
              <Headwear />
            ) : isShoes ? (
              <Shoes />
            ) : isClothing ? (
              <Clothing />
            ) : isAccessories ? (
              <Accessories />
            ) : (
              <All />
            )}
          </div>

          <div className="">
            <span className="text-sm  text-gray-500 ">Sort by</span>

            <ul>
              <li>
                <Link href="#">Relevance</Link>
              </li>
              <li>
                <Link href="#">Trending</Link>
              </li>
              <li>
                <Link href="#">Latest arrivals</Link>
              </li>
              <li>
                <Link href="#">Price: Low to high</Link>
              </li>
              <li>
                <Link href="#">Price: High to low</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
