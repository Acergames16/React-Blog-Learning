interface InputProps {
label: string;
type: 'text' | 'email' | 'password' | 'number';
value?: string;
placeholder?: string;
onChange?: (value: string) => void;
}

export const Input = ({ label, type, value, placeholder, onChange }: InputProps) => {
  return (

    <div>
        <label className='block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1'> {label} </label>

        <input
        type = { type}
        value = { value }
        placeholder = { placeholder }
        onChange = { (e) => onChange && onChange(e.target.value) }
        className='w-full p-3 mb-3 border border-gray-300 bg-white rounded-none focus:border-black focus:outline-none transition-colors' required
        />

    </div>
  )
}
