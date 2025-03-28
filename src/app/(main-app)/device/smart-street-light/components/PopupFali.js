import { Modal } from "@mantine/core";

const ModalFail = (props) => {
  const {
    data,
    status,
    onCloseModal,
    title = "Error",
    content = "Something went wrong!!",
    buttonTypeColor = "primary",
  } = props;

  const onClickOk = () => {
    onClickConfirmBtn();
  };

  const getButtonColor = () => {
    switch (buttonTypeColor) {
      case "primary":
        return "bg-[#87BE33]";
      case "danger":
        return "bg-[#EF4835]";

      default:
        return "bg-[#87BE33]";
    }
  };

  return (
    <>
      <Modal
        size="md"
        opened={true}
        onClose={() => onClickOk && onClickOk(false)}
        withCloseButton={false}
        closeOnClickOutside={false}
        centered
        style={{ zIndex: 9999, padding: 0 }}
        styles={{ body: { padding: 0, borderRadius: "12px" } }}
      >
         <div className="p-4 dark:bg-gray-800 border dark:text-white border-gray-600 rounded-md">
        <div className="pt-4 pb-5">
          <div className="sm:mt-4">
            <h6
              className="text-2xl leading-6 font-bold text-[#071437] text-center dark:text-white"
              id="modal-headline"
            >
              {title}
            </h6>
            <div className="mt-4">
              <p className="text-md text-gray-600 text-center dark:text-white" dangerouslySetInnerHTML={{ __html: content }}/>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-3 pb-2">
          <button
            onClick={onCloseModal}
            className="w-40 rounded shadow-sm px-4 py-2 font-normal bg-[#ff2424] text-white"
          >
            Close
          </button>
        </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalFail;
