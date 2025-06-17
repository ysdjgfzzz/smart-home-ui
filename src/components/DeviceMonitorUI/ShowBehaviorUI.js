import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { findAllBehavior } from '../../services/api';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  font-family: Arial, sans-serif;
  padding: 20px;
  color: white;
  overflow-y: auto;
`;

const Container = styled.div`
  max-width: 1200px;
  min-width: 1200px;
  width: 100%;
  max-height: 70vh;         // 最大高度为视口高度的70%
  margin: 60px auto 0 auto; // 顶部留白
  background: rgba(255,255,255,0.04);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  overflow-y: auto;         // 超出部分可滚动
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.h1`
  color: white;
  font-weight: bold;
  margin: 0 0 24px 0;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const BehaviorTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(255,255,255,0.04);
`;

const Th = styled.th`
  padding: 8px 12px;
  background: rgba(66, 133, 244, 0.2);
  color: #fff;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  color: #fff;
`;

const EmptyText = styled.div`
  color: rgba(255,255,255,0.7);
  text-align: center;
  margin: 40px 0;
`;

const ShowBehaviorUI = () => {
  const [behaviorList, setBehaviorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const behaviorRes = await findAllBehavior(username);
        const allBehaviors = Array.isArray(behaviorRes?.data?.data) ? behaviorRes.data.data : []
        setBehaviorList(allBehaviors);
        // console.log(behaviorList);
      } catch (err) {
        setError('获取行为记录失败');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <PageContainer>
      <Container>
        <Title>所有用户行为记录</Title>
        {loading ? (
          <EmptyText>加载中...</EmptyText>
        ) : error ? (
          <EmptyText>{error}</EmptyText>
        ) : behaviorList.length === 0 ? (
          <EmptyText>暂无行为记录</EmptyText>
        ) : (
          <BehaviorTable>
            <thead>
              <tr>
                <Th>用户名</Th>
                <Th>设备</Th>
                <Th>操作</Th>
                <Th>时间</Th>
              </tr>
            </thead>
            <tbody>
              {behaviorList.map((b, idx) => (
                <tr key={idx}>
                  <Td>{b.username}</Td>
                  <Td>{b.device_name}</Td>
                  <Td>{b.action}</Td>
                  <Td>{b.update_time}</Td>
                </tr>
              ))}
            </tbody>
          </BehaviorTable>
        )}
      </Container>
    </PageContainer>
  );
};

export default ShowBehaviorUI;
