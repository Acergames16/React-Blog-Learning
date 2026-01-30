import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom'
import { Footer } from '../../components/ui/Footer';

const LandingPage = () => {
    const navigate = useNavigate();
   
    return (
            <div className='flex flex-col min-h-screen items-center justify-center bg-black-500 px-4'>

                {/* Main Card - removed for now border border-gray-900, parang saas lang */}
                <img src={logo} className='w-25 h-25' />
                <div className='max-w-2xl w-full text-center bg-white px-10 pb-8'>

                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>Welcome to Acestylus</h1> 
                    <p className='text-gray-500 mb-8'>Your go-to platform for sharing and discovering amazing blog posts.</p>

                    <div className='flex justify-center gap-4'>
                
                        <button 
                        type='button'
                        onClick={()=>navigate('/login')} 
                        className='w-33 py-2.5 bg-black text-white rounded-3xl font-medium hover:bg-gray-800 transition-colors cursor-pointer'>
                        Login
                        </button>
                
                    
                        <button 
                        type='button'
                        onClick={()=>navigate('/register')} 
                        className='w-33 py-2.5 border border-gray-300 text-black rounded-3xl font-medium hover:bg-gray-100 transition-colors cursor-pointer'>
                        Register
                        </button>
                
                    </div>
                </div>

                <hr className='w-full max-w-md border-t border-gray-200 mt-1' />

                <Footer />
            </div>
    )
}

export default LandingPage