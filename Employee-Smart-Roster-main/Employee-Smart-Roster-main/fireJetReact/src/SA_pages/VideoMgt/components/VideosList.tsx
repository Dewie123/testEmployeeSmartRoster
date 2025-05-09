import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton';
import SA_LandingMgtController from '../../../controller/SA_LandingMgtController'

import { BiSolidShow } from '../../../../public/Icons.js'
import '../VideoMgt.css'
import '../../../../public/styles/common.css'
import { useState } from 'react';
import { any } from 'prop-types';


interface AllVideoProps {
    videos: any;
    updatePreviewVideo: (url: string) => void
    updateLandingVideo: (id: number, url: string) => void
}

const { filterIsShownVideo } = SA_LandingMgtController

const AllVideos = ({videos, updatePreviewVideo, updateLandingVideo}: AllVideoProps) => {
    // console.log(videos)
    const location = useLocation()
    const isVideoMgt = location.pathname.includes('video-management');
    const [ selectedVideo, setSelectedVideo ] = useState<number>()
    useEffect(() => {
        const video = filterIsShownVideo(videos, 1)
        // console.log(video)
        setSelectedVideo(video[0].id)
    }, [videos])

    return(
        <div className={`${isVideoMgt ? 'set-visible' : 'App-mobile-responsive-table'}`}>
            {videos.map((video:any) => (
            <div key={video.id}>
                <div 
                    className={`App-mobile-responsive-table-card sa-view-video-display-card
                        ${video.id === selectedVideo ? 'onhover' : ''}`}
                    onClick={() => {
                        updatePreviewVideo(video.url)
                        setSelectedVideo(video.id)
                    }}
                >
                    <div className="App-mobile-responsive-table-card-data-detail uploaded-demo-video-list-item">
                        <h4>{video.title}</h4>
                        <div className="btns-grp">
                            {video.isShown === 0 ? (
                                <PrimaryButton 
                                    text='Display on Landing'
                                    onClick={() => updateLandingVideo(video.id, video.url)}
                                />
                            ):(
                                <p>Displayed in Landing</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            ))}
        </div>
    )
}

export default AllVideos