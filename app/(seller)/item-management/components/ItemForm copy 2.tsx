"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { HiOutlineUpload, HiOutlineXCircle } from "react-icons/hi";
import { listCategories } from "@/lib/api/category";
import { addItem, updateItem } from "@/lib/api/items";
import { getMyShop } from "@/lib/api/seller/shop";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
import { capitalizeWords } from "@/utils/formatWord";
import SelectDropdown from "../../dashboard/components/commons/Fields/SelectDropdown";
import Category from "@/interfaces/category";
import {
  DIMENSION_OPTIONS,
  PRICING_MODEL_OPTIONS,
  DELIVERY_METHOD_OPTIONS,
  SIZE_UNIT_OPTIONS,
} from "@/setting";

// --- Types ---
type DropdownOption = {
  label: string;
  value: string;
  children?: DropdownOption[];
};

interface ItemFormProps {
  onClose: () => void;
  item?: any;
}

// --- Helper Constants ---
const EMPTY_OPTION: DropdownOption = { label: "", value: "" };
const MAX_IMAGES = 7;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

export default function ItemForm({ onClose, item }: ItemFormProps) {
  // --- Loading / Shop ---
  const [loading, setLoading] = useState(false);
  const [shopType, setShopType] = useState<string | null>(null);
  const [categories, setCategories] = useState<DropdownOption[]>([]);

  // --- Form State ---
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [notifyUser, setNotifyUser] = useState(true);
  const [salesPrice, setSalesPrice] = useState(
    item?.sales_price?.toString() ?? ""
  );
  const [regularPrice, setRegularPrice] = useState(
    item?.regular_price?.toString() ?? ""
  );
  const [quantity, setQuantity] = useState(item?.quantity?.toString() ?? "0");

  const [weight, setWeight] = useState(item?.weight?.toString() ?? "");
  const [weightUnit, setWeightUnit] = useState<DropdownOption>(
    DIMENSION_OPTIONS.find((d) => d.value === item?.weight_unit) ?? EMPTY_OPTION
  );
  const [lengthVal, setLengthVal] = useState(item?.length?.toString() ?? "");
  const [widthVal, setWidthVal] = useState(item?.width?.toString() ?? "");
  const [heightVal, setHeightVal] = useState(item?.height?.toString() ?? "");
  const [sizeUnit, setSizeUnit] = useState<DropdownOption>(
    SIZE_UNIT_OPTIONS.find((s) => s.value === item?.size_unit) ?? EMPTY_OPTION
  );

  const [selectedCategory, setSelectedCategory] =
    useState<DropdownOption>(EMPTY_OPTION);
  const [selectedChildCategory, setSelectedChildCategory] =
    useState<DropdownOption>(EMPTY_OPTION);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    item?.images ?? []
  );

  const [pricingModel, setPricingModel] = useState<DropdownOption>(
    PRICING_MODEL_OPTIONS.find((o) => o.value === item?.pricing_model) ??
      EMPTY_OPTION
  );
  const [deliveryMethod, setDeliveryMethod] = useState<DropdownOption>(
    DELIVERY_METHOD_OPTIONS.find((o) => o.value === item?.delivery_method) ??
      EMPTY_OPTION
  );
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState(
    item?.estimated_delivery_time ?? ""
  );
  const [availableDays, setAvailableDays] = useState<string[]>(
    item?.available_days ?? []
  );
  const [availableFrom, setAvailableFrom] = useState(
    item?.available_from ?? ""
  );
  const [availableTo, setAvailableTo] = useState(item?.available_to ?? "");

  const dayOptions = useMemo(
    () => [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    []
  );

  // --- Init ---
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const shopRes = await getMyShop();
        if (!mounted) return;

        setShopType(shopRes?.data?.type ?? "services");

        const { categories }: { categories: Category[] } = await listCategories(
          100,
          0,
          "",
          shopRes?.data?.type
        );
        if (!mounted) return;

        const formatted: DropdownOption[] = categories.map((cat) => ({
          label: cat.name,
          value: String(cat.id),
          children: (cat.children ?? []).map((child) => ({
            label: child.name,
            value: String(child.id),
          })),
        }));

        setCategories(formatted);

        if (item?.category_id) {
          const cat = formatted.find(
            (c) => c.value === String(item.category_id)
          );
          if (cat) {
            setSelectedCategory(cat);
            const sub = cat.children?.find(
              (c) => c.value === String(item.child_category_id)
            );
            if (sub) setSelectedChildCategory(sub);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load shop data or categories");
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, [item]);

  // --- Images ---
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const combined = [...imageFiles, ...files];
    if (combined.length > MAX_IMAGES)
      return toast.error(`Maximum ${MAX_IMAGES} images allowed`);

    for (const f of files) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(f.type))
        return toast.error("Only JPG, PNG, WebP allowed");
      if (f.size > MAX_IMAGE_SIZE)
        return toast.error("Each image must be smaller than 2MB");
    }

    setImageFiles(combined);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    e.currentTarget.value = "";
  };

  const removeImageAt = (idx: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // --- Validation ---
  const validateForm = (): string | null => {
    if (!title.trim() || title.length < 5)
      return "Title is required (min 5 chars)";
    if (title.length > 100) return "Title max 100 characters";
    if (!description.trim() || description.length < 100)
      return "Description min 100 characters";

    if (imagePreviews.length < 2) return "Upload at least 2 images";
    if (selectedCategory.value === "") return "Please select a category";
    if (selectedCategory.children?.length && selectedChildCategory.value === "")
      return "Please select a subcategory";

    const isValidNumber = (v: string) =>
      v === "" || (!isNaN(Number(v)) && Number(v) >= 0.1 && Number(v) <= 10000);
    if (!isValidNumber(weight)) return "Weight must be between 0.1 and 10000";
    if (!isValidNumber(lengthVal))
      return "Length must be between 0.1 and 10000";
    if (!isValidNumber(widthVal)) return "Width must be between 0.1 and 10000";
    if (!isValidNumber(heightVal))
      return "Height must be between 0.1 and 10000";

    if (shopType === "services") {
      if (!pricingModel.value) return "Select pricing model";
      if (!deliveryMethod.value) return "Select delivery method";
      if (!estimatedDeliveryTime) return "Estimated delivery time required";
      if (!availableDays.length) return "Select at least one available day";
      if (!availableFrom || !availableTo) return "Available from/to required";
      if (availableFrom.replace(/\s+/g, "") >= availableTo.replace(/\s+/g, ""))
        return "'To' must be after 'From'";
    }

    if (
      salesPrice === "" ||
      isNaN(Number(salesPrice)) ||
      Number(salesPrice) < 0
    )
      return "Invalid sales price";
    if (
      regularPrice === "" ||
      isNaN(Number(regularPrice)) ||
      Number(regularPrice) < 0
    )
      return "Invalid regular price";
    if (Number(salesPrice) >= Number(regularPrice))
      return "Sales price must be lower than regular price";

    if (
      quantity === "" ||
      isNaN(Number(quantity)) ||
      Number(quantity) < 0 ||
      !Number.isInteger(Number(quantity))
    )
      return "Quantity must be a non-negative integer";

    return null;
  };

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const err = validateForm();
      if (err) return toast.error(err);

      const fd = new FormData();
      fd.append("title", capitalizeWords(title));
      fd.append("description", description);
      fd.append("notify_user", String(notifyUser ? 1 : 0));

      const categoryId = selectedChildCategory.value || selectedCategory.value;
      fd.append("category_id", categoryId);

      if (weight) fd.append("weight", weight);
      if (weightUnit.value) fd.append("weight_unit", weightUnit.value);
      if (lengthVal) fd.append("length", lengthVal);
      if (widthVal) fd.append("width", widthVal);
      if (heightVal) fd.append("height", heightVal);
      if (sizeUnit.value) fd.append("size_unit", sizeUnit.value);

      if (shopType === "services") {
        fd.append("pricing_model", pricingModel.value);
        fd.append("delivery_method", deliveryMethod.value);
        fd.append("estimated_delivery_time", estimatedDeliveryTime);
        fd.append("available_days", JSON.stringify(availableDays));
        fd.append("available_from", availableFrom);
        fd.append("available_to", availableTo);
      }

      fd.append("sales_price", salesPrice);
      fd.append("regular_price", regularPrice);
      fd.append("quantity", quantity);

      imageFiles.forEach((f) => fd.append("images[]", f));

      if (item?.id) {
        await updateItem(item.id, fd);
        toast.success("Item updated successfully");
      } else {
        await addItem(fd);
        toast.success("Item added successfully");
      }

      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Error saving item");
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---
  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-gray-800">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          maxLength={50}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <TinyMCEEditor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={description}
          init={{
            height: 200,
            menubar: false,
            plugins: "link lists",
            toolbar:
              "undo redo | formatselect | bold italic underline | bullist numlist | link",
            content_style:
              "body { font-family:Inter,Arial,sans-serif; font-size:14px; color:#374151 }",
          }}
          onEditorChange={(content) => setDescription(content)}
        />
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-yellow-500">(required)</span>
        </label>
        <SelectDropdown
          options={categories}
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      {selectedCategory.children?.length ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subcategory <span className="text-yellow-500">(required)</span>
          </label>
          <SelectDropdown
            options={selectedCategory.children}
            value={selectedChildCategory}
            onChange={setSelectedChildCategory}
          />
        </div>
      ) : null}

      {/* Prices / Quantity */}
      <div className="grid grid-cols-3 gap-4">
        <input
          value={salesPrice}
          onChange={(e) => setSalesPrice(e.target.value)}
          className="input"
          placeholder="Sales Price"
        />
        <input
          value={regularPrice}
          onChange={(e) => setRegularPrice(e.target.value)}
          className="input"
          placeholder="Regular Price"
        />
        {shopType === "products" && (
          <input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input"
            placeholder="Quantity"
          />
        )}
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Item Images (min 2, max 7, 2MB each){" "}
          <span className="text-red-500">*</span>
        </label>

        {imagePreviews.length < MAX_IMAGES && (
          <label className="relative w-full aspect-square border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-amber-500 hover:bg-amber-50 flex items-center justify-center">
            <div className="flex flex-col items-center text-gray-500">
              <HiOutlineUpload className="text-3xl" />
              <span className="text-sm mt-2">
                Click to upload or drag and drop
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImagesChange}
            />
          </label>
        )}

        <div className="mt-3 grid grid-cols-3 gap-2">
          {imagePreviews.map((src, idx) => (
            <div
              key={idx}
              className="relative rounded-lg overflow-hidden h-28 border border-orange-950"
            >
              <Image
                src={src}
                alt={`preview-${idx}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImageAt(idx)}
                className="absolute top-1 right-1 bg-red-200 rounded-full p-1 hover:bg-red-400"
              >
                <HiOutlineXCircle />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 text-white py-2 px-4 rounded-xl hover:opacity-95 disabled:opacity-60"
      >
        {loading ? "Saving..." : item?.id ? "Update item" : "Save changes"}
      </button>
    </form>
  );
}
