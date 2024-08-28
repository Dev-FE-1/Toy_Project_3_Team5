import { Outlet, useParams } from 'react-router-dom';

export const PlayListHome = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>플레이 리스트 기본 화면 받은 아디는 {id} 입니다.</h1>
      <Outlet />
    </div>
  );
};
