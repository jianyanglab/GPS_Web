import React, { useState, useEffect, useRef} from 'react';
import { Layout, Menu, Button, Drawer, Radio, Space, ConfigProvider } from 'antd';
import {
    DeploymentUnitOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';


const { Sider } = Layout;
const icon = DeploymentUnitOutlined; // 设置图标为 VideoCameraOutlined

const Draw = ({texts, setSelectedPath }) => {
    const history_picture = useRef(null);
    const [open, setOpen] = useState(false);
    const [phitems, setPhitems] = useState([]);
    const history = useHistory();
    
    const showDrawer = () => {
        setOpen(true);
      };
      const onClose = () => {
        setOpen(false);
      };
    const varChange = (e) => {  
        
    fetch(`http://localhost:3000/pictures/${texts[e.target.value]}.txt`)
        .then(response => response.text())
        .then(data => {
        const fileNames = data.split('\n');
        const items = fileNames.map((filename, i) => {
            if (filename) {
            return {
                key: String(i),
                icon: React.createElement(icon),
                label: filename,
                variety: texts[e.target.value]
            };
            }});
        // phitems.current = items
        setPhitems(items);//加载两次selectedPath
        
        
        // 设置点击每个trait都默认第一个片子
        if (texts[e.target.value] && phitems[0]) {
            
            if (!history_picture.current){
                    history_picture.current = items[0]['label']
            } else {
                const itemValues = Object.values(items);
                const isCurrentInLabels = itemValues.some(row => row.label === history_picture.current);
                if (!isCurrentInLabels){
                    history_picture.current = items[0]['label']
            }
                
            }
            // setSelectedPath(`http://localhost:3000/mouse_variety/${texts[e.target.value]}/${phitems[0]['label']}.txt`);
            setSelectedPath(`http://localhost:3000/mouse_variety/${texts[e.target.value]}/${history_picture.current}.txt`);
        }            
        })
        .catch(error => {
            // 处理失败的回调函数
            console.error(error);
            // 跳转到其他页面
            
            history.push('/404');
          }
        );     
    };       

    useEffect(() => {
        // 在组件或其他地方调用 varChange 时传递默认值
        if(texts[0]){
        varChange({ target: { value: '0' } });}
    },[texts]) // 示例，默认调用第一个选项

    const handleMenuClick = (e) => {
        const baseUrl = "http://localhost:3000/mouse_variety/";
        const variety = phitems[e.key]['variety'];
        const label = phitems[e.key]['label'];
        // 使用模板字符串拼接路径
        const data_path = `${baseUrl}${variety}/${label}.txt`;
        history_picture.current = label
        setSelectedPath(data_path);
    };

    return (
        <div>
            <Sider style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1
            }}>
            <div style={{ position: 'sticky', top: 0, left: 0, zIndex: 2}}>
            {/* Variety主题 */}    
            <Space style={{background: '#022640', height:'7.78vh'}}>
                <ConfigProvider theme={{ components: {Button: {defaultGhostBorderColor: "#959494", defaultGhostColor: "#dddcdc"},} }}>
                <Button  ghost onClick={showDrawer} size='large'  style={{height:50, width:180, margin:10,fontWeight: 'bold',fontSize: 18}}>Traits</Button>
                </ConfigProvider>
            </Space>
            </div>
            
            {/* Variety抽屉 */}
            <Drawer title={<div style={{
                fontSize: 28,
                color: '#000000',
                fontWeight: 'bold',
                }}>Trait Select</div>} 
                placement="right" closable={false} onClose={onClose} open={open} width={300}>
               <Radio.Group onChange={varChange}  buttonStyle = 'solid'>
                <Space size={[8, 16]} wrap direction="vertical">
                    {texts.map((texts, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Radio.Button  value={index}style={{border: 'none',fontSize: 15}}>{texts}</Radio.Button>
                    ))}
                </Space>
                </Radio.Group>
            </Drawer>

            {/* Menu主题 */}
            <ConfigProvider theme={{ components: {Menu: {darkItemBg: '#022640',textColor: '#333',darkItemSelectedBg:'#6495ED', darkItemColor:'#C4D2EB', darkPopupBg:'white'},} }}>
                <Menu style= {{minHeight: '100vh', zIndex: 0}} theme='dark' mode="inline" defaultSelectedKeys={['0']} onClick={handleMenuClick} items={phitems}/>
            </ConfigProvider>
                 
        </Sider>
        </div>
    );
    };

export default Draw;
