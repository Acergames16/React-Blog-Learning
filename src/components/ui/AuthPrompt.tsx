
import { Link } from 'react-router-dom'

interface AuthPromptProps {
  text: string;
  linkText: string;
  linkTo: string;
}

export const AuthPrompt = ({ text, linkText, linkTo }: AuthPromptProps) => {
  return (
    <div className='mt-8 text-center'>  
        <p className='text-sm text-gray-600'>
            {text}{' '}
            <Link to={linkTo} className='font-bold text-black underline underline-offset-4  hover:text-gray-600  transition-colors'>
            {linkText}
            </Link>
        </p>
    </div>
  )
}
