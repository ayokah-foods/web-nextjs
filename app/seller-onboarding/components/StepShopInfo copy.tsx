"use client";

import SelectField from "@/app/components/common/SelectField";
import { useState, useEffect, useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { BeatLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";

import counties from "@/data/uk-counties.json";
import citiesData from "@/data/uk-cities.json";
import { listCategories } from "@/lib/api/category";
import { saveShop } from "@/lib/api/seller/shop";
import { FaShoppingBag } from "react-icons/fa";
import toast from "react-hot-toast";
import { StepProps } from "@/interfaces/stepProps";

interface SelectOption {
  id: number;
  name: string;
}

interface FadeSlideProps {
  children: React.ReactNode;
  keyId: string | number;
}

const FadeSlide = ({ children, keyId }: FadeSlideProps) => (
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

export default function StepShopInfo({ onNext }: StepProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");

  const types: SelectOption[] = [
    { id: 2, name: "Products" },
    { id: 1, name: "Services" },
  ];
  const [selectedType, setSelectedType] = useState<SelectOption>(types[0]);

  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SelectOption | null>(
    null
  );

  const countyOptions: SelectOption[] = counties.map((c, i) => ({
    id: i + 1,
    name: c.name,
  }));
  const allCities = Object.entries(citiesData).map(([city, county]) => ({
    city,
    county,
  }));
  const [selectedCounty, setSelectedCounty] = useState<SelectOption>(
    countyOptions[0]
  );
  const [selectedCity, setSelectedCity] = useState<SelectOption>({
    id: 0,
    name: "",
  });
  const [cityOptions, setCityOptions] = useState<SelectOption[]>([]);
  const [isCityLoading, setIsCityLoading] = useState(false);

  // Submission State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const LIMIT = 5000;

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

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError("");
      setCategories([]);
      setSelectedCategory(null);

      const typeString = selectedType.name.toLowerCase();

      try {
        const response = await listCategories(50, 0, undefined, typeString);

        const formatted: SelectOption[] =
          response?.categories?.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
          })) ?? [];

        setCategories(formatted);
        setSelectedCategory(formatted[0] ?? null);
      } catch (err: any) {
        console.error("Failed to load categories:", err);
        setCategoriesError("Failed to load categories. Please try again.");
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [selectedType]);

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const currentLength = e.target.value.length;
      setDescription(e.target.value);

      const counter = e.target.nextElementSibling as HTMLElement | null;
      if (!counter) return;

      counter.textContent = `${currentLength} / ${LIMIT}`;
      if (currentLength > LIMIT * 0.9) {
        counter.classList.replace("text-gray-400", "text-red-500");
      } else {
        counter.classList.replace("text-red-500", "text-gray-400");
      }
    },
    [LIMIT]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory || categories.length === 0) {
      setErrorMsg("Please select a valid category.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const formData = new FormData();

      // Form Data
      formData.append("name", name);
      formData.append("address", address);
      formData.append("description", description);
      formData.append("phone", phoneNumber);

      formData.append("type", selectedType.name.toLowerCase());

      formData.append("state", selectedCounty.name);
      formData.append("city", selectedCity.name);
      formData.append("country", "United Kingdom");

      formData.append("category_id", String(selectedCategory.id));

      formData.append("logo", "");
      formData.append("banner", "");

      const response = await saveShop(formData);
      console.log("Create Shop Response:", response);
      if (response.status === "success") {
        toast.success("Shop Info received successfully!");
        onNext({ shopId: response.data.id });
      } else {
        setErrorMsg(
          response.message || "Shop could not be created. Try again."
        );
        toast.error(
          response.message || "Shop could not be created. Try again."
        );
      }
    } catch (error: any) {
      setErrorMsg(
        error?.response?.data?.message ??
          "An unknown error occurred while creating the shop."
      );
      toast.error(
        error?.response?.data?.message ??
          "An unknown error occurred while creating the shop."
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormDisabled =
    loading ||
    categoriesLoading ||
    cityOptions.length === 0 ||
    !selectedCategory;

  return (
    <div className="h-full">
      <div className="border border-orange-100 p-4 rounded-md mb-6">
        <h2 className="text-lg font-semibold flex items-center">
          <FaShoppingBag className="text-orange-800 text-xl mr-2" size={24} />
          Shop or Business Information
        </h2>
        <p className="text-sm mt-1 text-gray-600">
          Please provide your shop or business details to get started.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 text-gray-900">
        {/* ERROR MESSAGE */}
        {errorMsg && (
          <div className="p-3 text-red-700 bg-red-100 rounded-md text-sm">
            {errorMsg}
          </div>
        )}

        {/* Shop Name */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Shop/Business name
          </label>
          <input
            className="input"
            placeholder="Shop Name"
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Type */}
        <FadeSlide keyId={selectedType.id}>
          <SelectField
            label="Shop/Business type"
            value={selectedType}
            onChange={setSelectedType}
            options={types}
          />
        </FadeSlide>

        {/* Category */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Shop/Business category
          </label>

          {categoriesLoading ? (
            <Skeleton height={45} borderRadius={10} />
          ) : categoriesError ? (
            <div className="text-red-500 text-sm">{categoriesError}</div>
          ) : (
            <FadeSlide
              keyId={selectedType.id + "-" + (selectedCategory?.id ?? "none")}
            >
              {categories.length > 0 && selectedCategory ? (
                <SelectField
                  label=""
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={categories}
                />
              ) : (
                <div className="h-[45px] flex items-center justify-center rounded-lg border bg-gray-50 text-gray-500 text-sm">
                  No categories available for {selectedType.name}
                </div>
              )}
            </FadeSlide>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">
            Shop/Business phone number
          </label>
          <input
            className="input"
            placeholder="Shop phone number"
            maxLength={15}
            minLength={12}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        {/* Address */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Shop/Business address
          </label>
          <input
            className="input"
            placeholder="Shop Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
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

        {/* City */}
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
            Shop/Business description
          </label>

          <div className="relative">
            <textarea
              className="input pr-16"
              placeholder="Tell us about your shop/business..."
              rows={5}
              maxLength={LIMIT}
              value={description}
              onChange={handleDescriptionChange}
              required
            />

            <span className="absolute bottom-2 right-3 text-xs text-gray-400">
              {description.length} / {LIMIT}
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isFormDisabled}
        >
          {loading ? (
            <>
              <BeatLoader size={8} color="white" /> Creating Shop...
            </>
          ) : (
            "Continue"
          )}
        </button>
      </form>
    </div>
  );
}
