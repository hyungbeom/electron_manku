
export default function Home(props) {
    console.log(props,'props:')
  return (
    <>
      <div style={{backgroundColor : 'red'}}>
123123123111
      </div>
    </>
  );
}



export async function getServerSideProps() {

    return {
        props: {  },
    };
}

