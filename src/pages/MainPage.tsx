import '../components/MainPage.css';
import CuratedCards from '../components/Curated-Cards'
import Challenges from '../components/Challenge';

function MainPage() {

    return (
    <div className="shadow-2xl min-h-[92vh] min-w-[97vw] bg-gray-100 pt-32 flex justify-center items-start">
        <CuratedCards />
        <h1 className="main-page-title text-4xl font-bold text-gray-600 pb-120">
            Welcome User!
        </h1>
        <Challenges />
    </div>
    )

}

export default MainPage;
