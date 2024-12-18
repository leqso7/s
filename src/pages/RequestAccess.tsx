import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface RequestAccessProps {
  onAccessGranted: () => void;
}

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  max-width: 100vw;
  background: linear-gradient(120deg, #ffeb3b 0%, #8bc34a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  overflow-x: hidden;
  margin: 0;
  position: fixed;
  top: 0;
  left: 0;
`;

const Form = styled.form`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
`;

const Button = styled.button`
  background: #4285f4;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #3367d6;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CodeDisplay = styled.div`
  margin-top: 20px;
`;

const CodeText = styled.p`
  font-weight: bold;
  font-size: 18px;
  color: #333;
`;

const StatusText = styled.p`
  font-size: 16px;
  color: #666;
`;

const ErrorText = styled.p`
  font-size: 16px;
  color: #721c24;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #4285f4;
  }
`;

const SavedCodesList = styled.div`
  margin-top: 20px;
  text-align: left;
`;

const SavedCodeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border: 1px solid #ddd;
  margin: 5px 0;
  border-radius: 5px;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const UseCodeButton = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  
  &:hover {
    background: #45a049;
  }
`;

const RequestAccess: React.FC<RequestAccessProps> = ({ onAccessGranted }) => {
  const [loading, setLoading] = useState(false);
  const [requestCode, setRequestCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedCodes, setSavedCodes] = useState<string[]>([]);
  const [inputCode, setInputCode] = useState('');

  useEffect(() => {
    // ჩავტვირთოთ შენახული კოდები
    const codes = JSON.parse(localStorage.getItem('accessCodes') || '[]');
    setSavedCodes(codes);
  }, []);

  useEffect(() => {
    const checkApprovalStatus = async () => {
      const savedStatus = localStorage.getItem('approvalStatus');
      if (savedStatus === 'approved') {
        onAccessGranted();
        return;
      }

      if (!requestCode) return;

      try {
        const { data, error: fetchError } = await supabase
          .from('access_requests')
          .select('status')
          .eq('code', requestCode)
          .single();

        if (fetchError) throw fetchError;

        if (data?.status === 'approved') {
          localStorage.setItem('approvalStatus', 'approved');
          onAccessGranted();
        }
      } catch (err) {
        console.error('Error checking status:', err);
      }
    };

    checkApprovalStatus();
    const interval = setInterval(checkApprovalStatus, 5000);

    return () => clearInterval(interval);
  }, [requestCode, onAccessGranted]);

  const generateCode = () => {
    // Generate a 5-digit number between 10000 and 99999
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputCode) {
      setRequestCode(inputCode);
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const code = generateCode();
      
      const { error: insertError } = await supabase
        .from('access_requests')
        .insert([{ 
          code, 
          status: 'pending',
          created_at: new Date().toISOString()
        }]);

      if (insertError) {
        throw insertError;
      }

      setRequestCode(code);
    } catch (err: any) {
      console.error('Error submitting request:', err);
      setError('მოთხოვნის გაგზავნა ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან.');
    } finally {
      setLoading(false);
    }
  };

  const useCode = (code: string) => {
    setRequestCode(code);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>მოთხოვნის გაგზავნა</Title>
        
        {!requestCode && (
          <>
            <Input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="შეიყვანეთ კოდი..."
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'იგზავნება...' : inputCode ? 'კოდის გამოყენება' : 'მოთხოვნის გაგზავნა'}
            </Button>
            
            {savedCodes.length > 0 && (
              <SavedCodesList>
                <h3>შენახული კოდები:</h3>
                {savedCodes.map((code, index) => (
                  <SavedCodeItem key={index}>
                    <span>{code}</span>
                    <UseCodeButton type="button" onClick={() => useCode(code)}>
                      გამოყენება
                    </UseCodeButton>
                  </SavedCodeItem>
                ))}
              </SavedCodesList>
            )}
          </>
        )}
        
        {requestCode && (
          <CodeDisplay>
            <CodeText>თქვენი კოდი: {requestCode}</CodeText>
            <StatusText>სტატუსი: მოლოდინში...</StatusText>
          </CodeDisplay>
        )}
        
        {error && <ErrorText>{error}</ErrorText>}
      </Form>
    </Container>
  );
};

export default RequestAccess;
