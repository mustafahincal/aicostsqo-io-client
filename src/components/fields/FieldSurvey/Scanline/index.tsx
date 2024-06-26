import { getFieldSurveyScanlines } from "@/api/scanline";
import { useSiteContext } from "@/contexts/Site";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
/* import {
  IoAddCircleOutline as AddIcon,
  IoClose as CloseIcon,
  IoSaveOutline as SaveIcon,
  IoSearchOutline as SearchIcon,
  IoTrashOutline as TrashIcon,
} from "react-icons/io5"; */

const SiteDiscontinuitiesData = () => {
  const [data, setData] = useState<any>([]);
  const { selectedSite } = useSiteContext();

  const fetchDiscData = async () => {
    try {
      const {
        site: { _id },
      } = selectedSite;
      const res = await getFieldSurveyScanlines(_id);
      const { scanlines, message, success } = res.data;
      if (!success) throw new Error(message);
      setData(scanlines);
      toast.success(message);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchDiscData();
  }, []);

  /* useEffect(() => {
    getRps()
      .then((newList) => setData(newList.data.rps))
      .catch((err) => console.log(err));
  }, []); */

  /*   const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setselectedRows(data.map((p: any) => p._id));
    else setselectedRows([]);
  };
  const handleSelectRow = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.checked) setselectedRows([...selectedRows, id]);
    else setselectedRows(selectedRows.filter((row) => row !== id));
  };
  const handleDeleteSelectedRows = (e: MouseEvent<HTMLDivElement>) => {
    const rowsToDelete = selectedRows;
    bulkDeleteRpDiscs(rowsToDelete)
      .then(async () => {
        await fetchDiscData();
      })
      .catch((err: any) => console.log(err));
    const updatedTableData = data.filter((row: any) => !row.isSelected);
    setData(updatedTableData);
  }; */

  return (
    <div className="flex flex-col modal-container py-3 min-h-[200px] justify-between">
      <h1 className="modal-container-title">Data Sets</h1>

      <div className="overflow-scroll my-10 mx-5">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">
                <input type="checkbox" /* onChange={handleSelectAll} */ />
              </th>
              <th className="py-3 px-6 text-left">Site Id</th>
              <th className="py-3 px-6 text-left">Id</th>
              <th className="py-3 px-6 text-left">Dip</th>
              <th className="py-3 px-6 text-left">Dip Direction</th>
              <th className="py-3 px-6 text-left">pX</th>
              <th className="py-3 px-6 text-left">pY</th>
              <th className="py-3 px-6 text-left">pZ</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {data?.map((p: any) => (
              <tr key={p._id} className="border-b border-gray-200">
                <td className="py-3 px-6 text-left">
                  <input
                    type="checkbox"
                    //   checked={selectedRows.includes(p._id)}
                    //   onChange={(e) => handleSelectRow(e, p._id)}
                  />
                </td>
                <td className="py-3 px-6 text-left">{p.siteId}</td>
                <td className="py-3 px-6 text-left">{p._id}</td>
                <td className="py-3 px-6 text-left">{p.dip}</td>
                <td className="py-3 px-6 text-left">{p.dipDirection}</td>
                <td className="py-3 px-6 text-left">{p.pX}</td>
                <td className="py-3 px-6 text-left">{p.pY}</td>
                <td className="py-3 px-6 text-left">{p.pZ}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/*  <div className="w-3/4 mx-auto">
        <div className="flex justify-between">
          <div
            className="flex flex-col gap-3 items-center cursor-pointer"
            data-modal-target="authentication-modal"
            data-modal-toggle="authentication-modal"
            onClick={() => setIsModalOpen(true)}
          >
            <AddIcon className="text-4xl" />
            <span className="text-lg">Add New Line</span>
          </div>
          <div className="flex flex-col gap-3 items-center cursor-pointer">
            <SearchIcon className="text-4xl" />
            <span className="text-lg">Search In</span>
          </div>
          <div
            className="flex flex-col gap-3 items-center cursor-pointer"
            // onClick={handleDeleteSelectedRows}
          >
            <TrashIcon className="text-4xl" />
            <span className="text-lg">Delete Selected Rows</span>
          </div>
          <div className="flex flex-col gap-3 items-center cursor-pointer">
            <SaveIcon className="text-4xl" />
            <span className="text-lg">Save</span>
          </div>
          <div className="flex flex-col gap-3 items-center cursor-pointer">
            <CloseIcon className="text-4xl" />
            <span className="text-lg">Cancel</span>
          </div>
        </div>
      </div> */}
      {/* 
      {isModalOpen ? (
        <AddDiscontinuity
          onClose={() => setIsModalOpen(false)}
          refetch={() => fetchDiscData()}
        />
      ) : null} */}
    </div>
  );
};

export default SiteDiscontinuitiesData;
