import React, { useEffect, useState } from 'react';
import BulletScreen from 'rc-bullets-ts';
import { Layout ,Button,message,Rate} from 'antd';
import PublicNav from '../../components/PublicNav';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment'
import FooterPart from '../../components/FooterPart';
import './index.scss'
import api from '../../api';
// 引入头像
import userImage from '../../assets/images/user.png'
const { Header,  Content } = Layout;

const headUrlList=[
  'https://pics5.baidu.com/feed/91529822720e0cf3076b2e9f413e2219bf09aab1.jpeg?token=9fa882676d8d5e144c7ad484eb91eaa0',
  'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_bt%2F0%2F13187151060%2F641&refer=http%3A%2F%2Finews.gtimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1670670062&t=a3e726a56b7852597f165a965248f171',
  'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202006%2F04%2F20200604121802_ChuaC.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1670670062&t=2bcb8d77bb093a62ebd82d0018e7f630',
  'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202009%2F10%2F20200910092747_9c68e.thumb.1000_0.png&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1670670062&t=6abffa7293095df3d47d60eb0e64a3d7',
  'https://img0.baidu.com/it/u=2387996997,2136413520&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
  'https://pics0.baidu.com/feed/fc1f4134970a304e28c36afa889ef68ec8175caf.jpeg@f_auto?token=d5c11bc1ae621d7403aed42fcd9880d5',
  'https://pics2.baidu.com/feed/cb8065380cd7912300e088a7f462088ab3b780bb.jpeg@f_auto?token=f979c35dcd36559c87b6ec45ba64386b',
  'https://p.qqan.com/up/2022-1/16414338085639631.jpg',
  'http://pic.imeitou.com/uploads/allimg/220324/5-220324160035.jpg',
  'http://pic.imeitou.com/uploads/allimg/220324/5-220324160020.jpg'
]
export default function AboutMe() {
  // 弹幕屏幕
  const [screen, setScreen] = useState(null);
  // 弹幕内容
  const [bullet, setBullet] = useState('');
  // 存储所有的弹幕
  const [bulletList,setBulletList]=useState([])

  // 通过moment获得当前时间
  let create_date=moment().format('YYYY-MM-DD HH:mm:ss')
  // 返回随机数
  function random(){
    let a=Math.random()*10
    return Math.floor(a);
  }
  useEffect(() => { 
    window.scrollTo(0, 0);
    api.getBulletScreen().then(res=>{
      if(res.data.status===200)
      {
        setBulletList(res.data.result)
        // 给页面中某个元素初始化弹幕屏幕，一般为一个大区块。此处的配置项全局生效
        let s = new BulletScreen('.screen',{duration:20});
        // or
        // let s=new BulletScreen(document.querySelector('.screen));
        setScreen(s);

        // 进入页面后显示所有的弹幕
        let i=0
        window.setInterval(()=>{
          // console.log(1);
          if(i<res.data.result.length)
          {
            // console.log(i);
            // 这里不用screen，因为useState异步性，此时screen还赋值完成
            s.push({msg:res.data.result[i].content ,head:headUrlList[random()],color:"#eee" ,size:"middle", backgroundColor:"rgba(2,2,2,.3)"})
            i+=1
          }
          
        },2500)
      }
    })
    
    

  }, []);
  // 弹幕内容输入事件处理
  const handleChange = ({ target: { value } }) => {
    setBullet(value);
  };
  // 发送弹幕
  const handleSend = () => {
    if (bullet) {
      
      // 1.push 纯文本
      // screen.push(bullet);

      // 2.或者使用 StyledBullet
      // screen.push(
      //   <StyledBullet
      //     head={headUrl}
      //     msg={bullet}
      //     backgroundColor={'#fff'}
      //     size='large'
      //   />
      // );

      // 3.或者还可以这样使用，效果等同使用 StyledBullet 组件
      screen.push({msg:bullet,head:headUrlList[random()],color:"#eee" ,size:"large", backgroundColor:"rgba(2,2,2,.3)"})
      
      message.success('发送成功')
      setBullet('')

      const params={
        id:bulletList.length+1,
        content:bullet,
        create_date
      }
      api.submitBulletScreen(params).then(res=>{
        //更新state的值，通过数组的解构赋值添加新的弹幕
         setBulletList(
          [
            ...bulletList,
            params
          ]
         )
      })
    }
  };
  return (
    <main>
      <div className="aboutme">
        <Layout>
          <Header>
            <PublicNav></PublicNav>
          </Header>
          <Content className='aboutmecontnet'>
            {/* 弹幕区域 */}
            <div className="bulletScreen">
              <div className="screen" ></div>
              <div className="bullet">
                <span className='title'>有什么想对博主说的呢？快点biubiu吧！</span>
                <input value={bullet} onChange={handleChange} />
                <Button size='middle' type='primary' onClick={handleSend}>发送弹幕</Button>
              </div>
              
            </div>
            <div className="userInfo">
              
              <h1><span><UserOutlined /></span>关于博主</h1>
              <div className="left">
                  <div className="userImg">
                    <img src={userImage} alt="" />
                  </div>
                  <div className='title'>"你不努力，谁也给不了你想要的生活！"</div>
              </div>
              <div className="right">
                <ul>
                  <li>
                    <span className="before">
                      姓名：
                    </span>
                    <span className="after">
                      王建功
                    </span>
                  </li>
                  <li>
                    <span className="before">
                      学历：
                    </span>
                    <span className="after">
                      硕士(在读)
                    </span>
                  </li>
                  <li>
                    <span className="before">
                      学校：
                    </span>
                    <span className="after">
                      中南财经政法大学(ZUEL) CS
                    </span>
                  </li>
                  <li>
                    <span className="before">
                      QQ：
                    </span>
                    <span className="after">
                      1553857505
                    </span>
                  </li>
                  <li>
                    <span className="before">
                      爱好：
                    </span>
                    <span className="after">
                      篮球 健身
                    </span>
                  </li>
                  <li>
                    <span className="before">
                      偶像：
                    </span>
                    <span className="after">
                      Leborn James
                    </span>
                  </li>

                </ul>
              </div>
              
            </div>
            <div className="mylog">
              <h1><span><UserOutlined /></span>关于本站</h1>
                <p>
                  &nbsp; &nbsp; &nbsp; &nbsp;本站是我在2022下半年搭建的第一个上线网站,从前台到后台，从部署到测试上线，学习到了很多知识，虽然中间遇到了很多问题，但是我从未
                  说过放弃，我享受这个过程，因为坚持自己所热爱❤❤的事本身就是快乐的。<br />
                  &nbsp; &nbsp; &nbsp; &nbsp;后面我会不断更新本站，记录自己的学习过程，见证自己的一点点进步(*^▽^*)<br />
                  &nbsp; &nbsp; &nbsp; &nbsp;本站后续会不断完善，在访问过程中各位uu有任何的问题和建议非常欢迎提出来，我们可以一起交流喔，当然如有幸帮助一些人解疑答惑当然是更好的！ 
                </p>
            </div>
            <div className="goal">
              <h1><span><UserOutlined /></span>小心愿~</h1>
              <div className="content">
                <div className='one'>
                  <Rate disabled defaultValue={5} />&nbsp; &nbsp;enfp女孩顺利上岸!
                </div>
                <div className='one'>
                  <Rate disabled  allowHalf defaultValue={4} />&nbsp; &nbsp;明年上半年找到满意的实习！
                </div>
                <div className='one'>
                  <Rate disabled allowHalf defaultValue={3.5} />&nbsp; &nbsp;珍惜美好的校园时光！
                </div>
                <div className='one'>
                  <Rate disabled  allowHalf defaultValue={3.5} />&nbsp; &nbsp;坚持所热爱的事情  篮球+健身
                </div>
              </div>

            </div>
        </Content>
        <FooterPart></FooterPart>
        </Layout>
      </div>
      
      
    </main>
  );
}