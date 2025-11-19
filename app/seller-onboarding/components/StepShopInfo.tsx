"use client";

import SelectField from "@/app/components/common/SelectField";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { BeatLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";

import counties from "@/data/uk-counties.json";
import citiesData from "@/data/uk-cities.json";

// Animation Wrapper
const FadeSlide = ({
  children,
  keyId,
}: {
  children: React.ReactNode;
  keyId: any;
}) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={keyId}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

export default function StepShopInfo() {
  const categories = [
    { id: 1, name: "Fashion" },
    { id: 2, name: "Electronics" },
    { id: 3, name: "Groceries" },
    { id: 4, name: "Beauty & Health" },
  ];

  const types = [
    { id: 1, name: "Retail" },
    { id: 2, name: "Wholesale" },
    { id: 3, name: "Both" },
  ];

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedType, setSelectedType] = useState(types[0]);

  const countyOptions = counties.map((c, i) => ({
    id: i + 1,
    name: c.name,
  }));

  const allCities = Object.entries(citiesData).map(([city, county]) => ({
    city,
    county,
  }));

  const [selectedCounty, setSelectedCounty] = useState(countyOptions[0]);
  const [selectedCity, setSelectedCity] = useState({ id: 0, name: "" });

  const [isCityLoading, setIsCityLoading] = useState(false);
  const [cityOptions, setCityOptions] = useState<any[]>([]);

  // Load cities with UI delay
  useEffect(() => {
    setIsCityLoading(true);

    const timer = setTimeout(() => {
      const filtered = allCities
        .filter((c) => c.county === selectedCounty.name)
        .map((c, idx) => ({
          id: idx + 1,
          name: c.city,
        }));

      setCityOptions(filtered);
      setSelectedCity(filtered[0] ?? { id: 0, name: "" });

      setIsCityLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedCounty]);

  const LIMIT = 5000;
  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const LIMIT = 5000;

    const counter = e.target.nextElementSibling as HTMLElement;
    counter.textContent = `${e.target.value.length} / ${LIMIT}`;

    if (e.target.value.length > LIMIT * 0.9) {
      counter.classList.add("text-red-500");
      counter.classList.remove("text-gray-400");
    } else {
      counter.classList.add("text-gray-400");
      counter.classList.remove("text-red-500");
    }
  }

  return (
    <form className="space-y-5 text-gray-900">
      {/* Shop Name */}
      <div>
        <label className="text-sm font-medium mb-1 block">Shop Name</label>
        <input className="input" placeholder="Shop Name" />
      </div>

      {/* Category */}
      <FadeSlide keyId={selectedCategory.id}>
        <SelectField
          label="Shop Category"
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={categories}
        />
      </FadeSlide>

      {/* Type */}
      <FadeSlide keyId={selectedType.id}>
        <SelectField
          label="Shop Type"
          value={selectedType}
          onChange={setSelectedType}
          options={types}
        />
      </FadeSlide>

      {/* Address */}
      <div>
        <label className="text-sm font-medium mb-1 block">Shop Address</label>
        <input className="input" placeholder="Shop Address" />
      </div>

      {/* County */}
      <FadeSlide keyId={selectedCounty.id}>
        <SelectField
          label="Province / County"
          value={selectedCounty}
          onChange={setSelectedCounty}
          options={countyOptions}
        />
      </FadeSlide>

      <div>
        <label className="text-sm font-medium mb-1 flex items-center gap-2">
          City
          {isCityLoading && <BeatLoader size={6} />}
        </label>

        <FadeSlide
          keyId={isCityLoading ? "loading" : selectedCity.id || "empty"}
        >
          {isCityLoading ? (
            <Skeleton height={45} borderRadius={10} />
          ) : cityOptions.length === 0 ? (
            // NO CITIES FOUND UI
            <div className="h-[45px] flex items-center justify-center rounded-lg border bg-gray-50 text-gray-500 text-sm">
              No cities available for this region
            </div>
          ) : (
            <SelectField
              label=""
              value={selectedCity}
              onChange={setSelectedCity}
              options={cityOptions}
            />
          )}
        </FadeSlide>
      </div>

      {/* Country */}
      <div>
        <label className="text-sm font-medium mb-1 block">Country</label>
        <input
          className="input bg-gray-100 cursor-not-allowed"
          value="United Kingdom"
          readOnly
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium mb-1 block">
          Shop Description
        </label>

        <div className="relative">
          <textarea
            className="input pr-16"
            placeholder="Shop Description"
            rows={5}
            maxLength={LIMIT}
            onInput={handleInput}
          />

          {/* Counter */}
          <span className="absolute bottom-2 right-3 text-xs text-gray-400">
            0 / {LIMIT}
          </span>
        </div>
      </div>
      {/* Button */}
      <button type="submit" className="btn-primary w-full">
        Continue
      </button>
    </form>
  );
}
