import { Modal } from "@mantine/core";

const ModalDone = (props) => {
  const {
    data,
    status,
    onCloseModal,
    title = "Done",
    content = "Your request accept",
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
        style={{
          zIndex: 9999, // Ensure the modal is always on top
          position: "fixed", // Fixed position so it stays on top of the page
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        overlayStyle={{
          zIndex: 9998, // Overlay just below the modal
        }}
      >
        <div className="pt-4 pb-5">
          <div className="sm:mt-4">
            <h6
              className="text-2xl leading-6 font-bold text-[#071437] text-center"
              id="modal-headline"
            >
              {title}
            </h6>
            <div className="mt-4">
              <p className="text-md text-gray-600 text-center" dangerouslySetInnerHTML={{ __html: content }}/>
            </div>
          </div>
        </div>
        
      </Modal>
    </>
  );
};

export default ModalDone;
