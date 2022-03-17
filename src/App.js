import logo from './logo.svg';
import './App.css';
import { useState } from "react"


//사용자 정의 태그(컴포넌트)를 만들때는 앞에 반드시 대문자
function Header(props){
  return <header>
        <h1><a href="/" onClick={(e) => {
          e.preventDefault();//페이지 리로드(기본동작) 비활성화
          props.onChangeMode();
        }}>{props.title}</a></h1>
  </header>
}
function Nav(props) {
  const lis = [];
  props.topics.map((item) => {
    lis.push(<li key={item.id}>
      <a id={item.id} href={'/read/'+item.id} onClick={(e) => {
        e.preventDefault();
        props.onChangeMode(Number(e.target.id));
      }}>{item.title}</a>
      </li>)
  })
  return (
    <nav>
      <ol>
        {lis}
      </ol>
    </nav>
  );
}
function Article(props) {
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}
function Create(props) {
  return (
    <article>
      <h2>Create</h2>
      <form onSubmit={event=>{
        event.preventDefault();
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onCreate(title, body);
      }}>
        <p><input type="text" name="title" placeholder='title'/></p>
        <p><textarea name="body" placeholder='body'></textarea></p>
        <p><input type="submit" value="create" /></p>
      </form>
    </article>
  )
}
function Update(props) {
  const [title, setTitle ] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return (
    <article>
      <h2>Update</h2>
      <form onSubmit={event=>{
        event.preventDefault();
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onUpdate(title, body);
      }}>
        <p><input type="text" name="title" placeholder='title' value={title} 
          onChange={
          e => {
            console.log(e.target.value);
            setTitle(e.target.value);
          }}/>
        </p>  
        <p><textarea name="body" placeholder='body' value={body} onChange={
          e => {
            console.log(e.target.value);
            setBody(e.target.value);
          }
        }></textarea></p>
        <p><input type="submit" value="Update" /></p>
      </form>
    </article>
  )
}
//prop은 컴포넌트를 사용하는 외부자를 위한 
//state는 컴포넌트를 사용하는 내부자를 위한
function App() {
  const [mode, setMode] = useState("WELCOME");
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([ 
    {id:1, title:'html',body:"html is...."},
    {id:2, title:'css',body:"css is...."},
    {id:3, title:'javascript',body:"javascript is...."},
  ]);
  let content = null
  let contextControll = null;
  
  if(mode === "WELCOME"){
    content = <Article title="Welcome" body="Hello, WEB"></Article>;
  }else if(mode === "READ"){
    let title, body = null;
    contextControll = <>
      <li><a href={"/update/"+id} onClick={e=>{
        e.preventDefault();
        setMode("UPDATE");
      }}>update</a></li>
      <li> <input type="button" value="Delete" onClick={() => {
        const newTopics = [];
        topics.map((topic) => {
          if(topic.id !== id){
            newTopics.push(topic);;
          }
        })
        setTopics(newTopics);
        setMode("WELCOME");

      }} /> </li>
    </> ;
    topics.map((topic) => {
      if(topic.id === id){
        title = topic.title;
        body = topic.body;
      }
    })
    content = <Article title={title} body={body}></Article>;
  }else if(mode === "CREATE"){
    content = <Create onCreate={(title, body)=>{
      //렌더링 때문에 이렇게 짬
      const newTopic = {id:nextId,title, body};
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode("READ");
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>;
  }else if(mode === "UPDATE"){
    let title, body= null;
    topics.map((topic) => {
      if(topic.id === id){
        title = topic.title;
        body = topic.body;
      }
    })
    content = <Update title={title} body={body} onUpdate={(title, body) => {
      console.log(title, body);
      const newTopics = [...topics]
      const updatedTopic = {id:id, title:title, body:body}
      for(let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }
  return (
    <div>
      <Header title="WEB" onChangeMode={() => {
        setMode("WELCOME");
      }}></Header>
      <Nav topics={topics} onChangeMode={(_id) => {
        setMode("READ");
        setId(_id);
      }}></Nav>
      {content}
      <ul>
        <li>
          <a href="/create" onClick={event=>{
          event.preventDefault();
          setMode("CREATE");
        }}>create</a>
        </li>
        {contextControll}
        {}
      </ul>
    </div>
  );
}

export default App;
