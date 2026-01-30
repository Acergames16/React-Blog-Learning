import React from 'react'
import { Input } from '../../../components/ui/Input'
import { SubmitButton} from '../../../components/ui/SubmitButton'
import { useDispatch, useSelector } from 'react-redux';
import { LoginUser } from '../AuthAction';
import type{ AppDispatch } from '../../../app/store';
import type { RootState } from '../../../app/store';
import { useNavigate } from 'react-router';


export const LoginForm = () => {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const error = useSelector((state: RootState) => state.auth.authError);
    const user = useSelector((state: RootState) => state.auth.user);
    const navigate = useNavigate();

    const dispatch = useDispatch<AppDispatch>();

    React.useEffect(() => {
      if (user) {
        navigate('/feed');
      }
    }, [user, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()      
        dispatch(LoginUser(email, password));
    };



  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit}>
      {error && <div className='text-red-500 text-sm mb-4'>{error}</div>}
      <Input label="Email" type="email" value={email} placeholder="Enter your email" onChange={setEmail} />
      <Input label="Password" type="password" value={password} placeholder="••••••••" onChange={setPassword} />
      <SubmitButton label="Log in" type="submit" />
      </form>
    </div>
  )
}
