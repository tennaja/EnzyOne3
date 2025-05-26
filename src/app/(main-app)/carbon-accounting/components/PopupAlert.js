import { Modal } from "@mantine/core";

const ModalConfirm = (props) => {
  const {
    onCloseModal,
    title = "An error occurred!",
    content = "This parameter is already added.",
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
              <p className="text-md text-center text-gray-600 dark:text-white" dangerouslySetInnerHTML={{ __html: content }}/>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-3 pb-2">

          <button
            onClick={onCloseModal}
            className={`bg-[#EF4835] w-40 rounded shadow-sm px-4 py-2 font-semibold text-white sm:text-sm  `}
          >
            Close
          </button>
        </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalConfirm;
