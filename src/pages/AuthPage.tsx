import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from '../store/useToast';
import { T } from '../utils/strings';
import { Mail, Lock, LogIn } from 'lucide-react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Đăng nhập thành công!');
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-bg-2 p-8 rounded-xl border border-border w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-accent mb-2">{T.appName}</h1>
          <p className="text-text-2 text-sm">{isLogin ? 'Đăng nhập để tiếp tục cuộc phiêu lưu' : 'Tạo tài khoản mới'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-2 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-text-2" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg-3 border border-border rounded-lg pl-10 pr-3 py-2 text-text focus:ring-2 focus:ring-accent outline-none"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-2 mb-1">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-text-2" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-3 border border-border rounded-lg pl-10 pr-3 py-2 text-text focus:ring-2 focus:ring-accent outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-2 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? 'Đang xử lý...' : (isLogin ? <><LogIn size={18}/> Đăng nhập</> : 'Đăng ký')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-text-2">
          {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-accent hover:underline font-medium">
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
}