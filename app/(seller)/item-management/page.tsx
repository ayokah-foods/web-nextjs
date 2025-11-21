import { LuPackage, LuPlus } from "react-icons/lu";
import ItemOverview from "./components/ItemOverview";
import ItemsTable from "./components/ItemsTable";

export default function ProductManagementPage() {
  return (
    <>
      <div className="card mb-6 hover:shadow-lg transition-all duration-300 rounded-xl bg-white cursor-default">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-orange-800!">
            <LuPackage />
            Items Managements
          </h2>
          <button
            className="
              btn btn-orange 
              flex items-center 
              p-2 lg:py-2 lg:px-4 lg:gap-1 
              sm:rounded-xl
            "
          >
            <LuPlus className="text-xl lg:text-lg" />
            <span className="hidden lg:inline">Add Item</span>{" "}
          </button>{" "}
        </div>

        <p className="text-sm mt-1 text-gray-600">
          From your Items management dashboard, you can easily check, modify and
          add new
          <span className="text-orange-800"> Items</span>
        </p>
      </div>

      <ItemOverview />

      <ItemsTable  limit={10} offset={0} status={'active'} />
      
    </>
  );
}
