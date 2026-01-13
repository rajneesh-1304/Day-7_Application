import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../redux/slice/slice';
import './login.css';
import { auth, provider } from '../../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const LoginUserSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(8, { message: "Password is required" }),
});

type LoginFormInputs = z.infer<typeof LoginUserSchema>;

interface UserState {
  users: LoginFormInputs[];
  isAuthenticated: boolean;
}

interface RootState {
  users: UserState;
}

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state: RootState) => state.users.users);
  const isAuthenticated = useSelector((state: RootState) => state.users.isAuthenticated);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleTogglePassword = () => setShowPassword(prev => !prev);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      dispatch(
        login({
          id: result.user.uid,
          name: result.user.displayName || 'User',
          email: result.user.email || '',
        })
      );

      setSnackbarMessage('Login successful!');
      setSnackbarOpen(true);
      setTimeout(() => navigate('/chat'), 1200);
    } catch {
      setSnackbarMessage('User not registered');
      setSnackbarOpen(true);
    }
  };

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await signInWithEmailAndPassword(auth, data.email, data.password);

      dispatch(
        login({
          id: response.user.uid,
          name: response.user.email?.split('@')[0] || 'User',
          email: response.user.email || '',
        })
      );

      setSnackbarMessage('Login successful!');
      setSnackbarOpen(true);
      setTimeout(() => navigate('/chat'), 1200);
    } catch {
      setSnackbarMessage('User not registered');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleRegisterNavigate = () => navigate('/register');

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: 300, gap: 2 }}>
          <Button variant="contained" sx={{ mt: 2, borderRadius: '1000px' }} onClick={handleSignIn}>
            Sign in With Google
          </Button>

          <div style={{ display: 'flex', width: 100, gap: 2 }}>
            <span><hr style={{ backgroundColor: 'gray', height: '1px', width: 150 }}/></span>
            <span>or</span>
            <span><hr style={{ backgroundColor: 'gray', height: '1px', width: 150 }}/></span>
          </div>

          <FormControl variant="standard">
            <TextField
              label="Email"
              variant="outlined"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ''}
            />
          </FormControl>

          <FormControl variant="standard">
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ''}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          <Button variant="contained" sx={{ mt: 2 }} type="submit">
            Login
          </Button>
        </Box>
      </form>

      <div className='register'>
        <p>
          Not Registered <span className='register_link' onClick={handleRegisterNavigate}>Register</span>
        </p>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        message={snackbarMessage}
      />
    </div>
  );
}
