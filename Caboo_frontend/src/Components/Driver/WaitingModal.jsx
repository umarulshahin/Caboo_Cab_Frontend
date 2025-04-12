import { useNavigate } from 'react-router-dom';

const WaitingModal = () => {
    const navigate = useNavigate();

    const closeModal = () => {
        navigate('/');
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
          <div className="border-b pb-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 text-center mx-auto">
                Thank You for Registering!
              </h3>
              <button
                className="text-gray-600 hover:text-gray-800 text-2xl ml-auto"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
          </div>
          <div className="mt-4 text-gray-700 text-center">
            <p>Your request has been received. We will review your details and send a confirmation email once the process is complete.</p>
            <p>Thank you for your patience!</p>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-500 focus:outline-none"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
      
    );
};

export default WaitingModal;
