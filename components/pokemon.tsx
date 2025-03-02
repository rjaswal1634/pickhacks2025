import * as React from 'react';
import { useEffect, useState } from 'react';

const PikachuAttributes = () => {
  const [attributes, setAttributes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 포켓몬 API에서 피카츄 정보를 가져오는 함수
    const fetchPikachuAttributes = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu');
        if (!response.ok) {
          throw new Error('피카츄 정보를 가져오는 데 실패했습니다.');
        }
        const data = await response.json();
        // 피카츄의 속성 추출
        const types = data.types.map((typeInfo: any) => typeInfo.type.name);
        setAttributes(types);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false);
      }
    };

    fetchPikachuAttributes();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  return (
    <div>
      <h1>피카츄의 속성</h1>
      <ul>
        {attributes.map((type, index) => (
          <li key={index}>{type}</li>
        ))}
      </ul>
    </div>
  );
};

export default PikachuAttributes;
