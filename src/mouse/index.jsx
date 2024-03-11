import Scat from '../Mouse_scatter';
import React, {useState, useEffect,} from 'react';
import { Layout, Button,} from 'antd';
import { RollbackOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import Draw from './draw_mou'


const { Header, Content, Footer,  } = Layout;


// 返回按钮
const BackButton = () => {
    const history = useHistory(); // 如果您正在使用React Router
  
    const handleBack = () => {
    //   history.goBack();
      history.push('/');
    };
  
    return (
        <Button onClick={handleBack} type="link"><RollbackOutlined style={{
            color : "#6495ED",
            marginTop: 12,
            fontSize: 30,
          }}/></Button>
    );
  };

// 页面主函数
const Mouse = () => {

    const [texts, setTexts] = useState([]);
    const [selectedPath, setSelectedPath] = useState('http://localhost:3000/mouse_variety/ADHD/E9.5_E1S1.txt');

    useEffect(() => {
      
        fetch("http://localhost:3000/mouse_variety.txt")
          .then(response => response.text())
          .then(data => {
            const lines = data.split('\n');
            setTexts(lines);
          });
      }, []);
    
    //片子选择
    useEffect(() => {
    fetch(`http://localhost:3000/default_picture.txt`)
          .then(response => response.text())
          .then(data_default_picture => {
            const picture_path = data_default_picture.split('\n');
            const url = `http://localhost:3000/${picture_path[0]}`
            setSelectedPath(url)
          })
        }, []);


    //下载文件
    const handleDownload = () => {
        const fileUrl = "https://example.com/file.pdf"; // 要下载的文件的URL
        window.open(fileUrl); // 打开文件下载链接
      };

    return (
        <Layout hasSider>
        <Draw texts={texts} setSelectedPath={setSelectedPath}/>
        <Layout
            style={{
            marginLeft: 200,
            }}
        >
            <Header className='ConcentBackColor'
            style={{
                padding: 0,
                background: "#ECECEC"
            }}>
                <div style={{
                    position: 'relative', 
                    display: 'flex',
                    flexDirection: 'row',
                }} > <BackButton /><h1 style={{
                    position: 'absolute',
                    top: '15%',
                    left: '42%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: 40,
                    color: '#00267E',
                    fontWeight: 'bold',
                    }}> Mouse</h1>
                    <Button onClick={handleDownload} type="primary"  style={{
                    position: 'absolute',
                    top: '105%',
                    right: '-8.5%',
                    transform: 'translate(-50%, -50%)',
                    background: '#6495ED',
                    height: '4.5vh'
                    }}>Download summary statisics <VerticalAlignBottomOutlined /></Button></div>
                
            </Header>
            <Content>
            {/* 导入scatter.js */}
            <Scat path={selectedPath}/> 
            </Content>
            <Footer
            style={{
                textAlign: 'center',
                background: "#D3D3D3",
            }}
            >
            GPS ©2023 Created by YangLab
            </Footer>
        </Layout>
        </Layout>
    );
};
export default Mouse;