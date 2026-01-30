
interface SubmitButtonProps {
    type?: 'button' | 'submit' | 'reset';
    label: string;  
    onClick?: () => void;
};
export const SubmitButton = ({ label, onClick, type }: SubmitButtonProps) => {

  return (
    <button 
    type={type}
    onClick={onClick} 
    className="w-full py-3 bg-gray-200 text-gray-600 font-medium  hover:bg-gray-300 transition-colors transition-all duration-300 cursor-pointer">
    {label}
    </button>
  )
}
