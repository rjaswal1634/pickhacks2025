import { useState, useEffect } from "react";
import { AuthApi } from "@/app/api/java/authApi"; // API 모듈 가져오기

function ChildCount({ userId }) {
  const [childCount, setChildCount] = useState(null); // 자녀 수 상태

  useEffect(() => {
    async function fetchChildrenCount() {
      try {
        const response = await AuthApi.getNumberOfChildren(userId); // API 호출
        setChildCount(response); // API 응답을 상태로 저장
      } catch (error) {
        console.error("Error fetching child count:", error);
        setChildCount("Error");
      }
    }

    if (userId) {
      fetchChildrenCount();
    }
  }, [userId]); // userId가 변경될 때마다 실행

  return (
    <div>
      {childCount !== null ? childCount : "Loading..."}
    </div>
  );
}

export default ChildCount;
