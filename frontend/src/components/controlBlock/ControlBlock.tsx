import ModalCreateTask from "../modal/ModalTask";
import { FaFilter, FaPlus } from "react-icons/fa6";
import React from "react";
import Filter from "../filter/Filter";
import { Button } from "antd";

const ConrolBlock = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const [openFilter, setOpenFilter] = React.useState(false);

  const handlerOpenModal = () => {
    setOpenModal(true);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <Button onClick={handlerOpenModal} color="primary" variant="solid">
        <FaPlus /> New Task
      </Button>
      <ModalCreateTask
        createModal={true}
        open={openModal}
        setOpen={setOpenModal}
      />
      <Button color="pink" variant={openFilter ? "solid" : "outlined"} onClick={() => setOpenFilter(!openFilter)}>
        <FaFilter /> Filters
      </Button>
      {openFilter && (
          <Filter />
      )}
    </div>
  );
};

export default ConrolBlock;
