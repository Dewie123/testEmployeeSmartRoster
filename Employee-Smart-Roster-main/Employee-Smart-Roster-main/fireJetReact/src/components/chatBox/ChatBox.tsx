import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAlert } from "../../components/PromptAlert/AlertContext";
import ChatBot from 'react-simple-chatbot';
import SAFAQController from "../../controller/SAFAQController";

import { BsChatLeftDotsFill } from "react-icons/bs";
import { IoClose, FiRefreshCw } from '../../../public/Icons.js';
import './ChatBox.css'
import '../../../public/styles/common.css'

// API call handler
const { handleSubmitQuesToChatBox } = SAFAQController;

// Custom component to fetch and display API answer
const ApiResponse = ({ previousStep, triggerNextStep }: any) => {
    const { showAlert } = useAlert();
    const [ answer, setAnswer ] = useState("Let me check for you...");


    const triggerSendQuestion = async() => {
        try {
                const response = await handleSubmitQuesToChatBox(previousStep.value);
                if (response?.answer) {
                    setAnswer(response.answer);
                } else {
                    setAnswer("Sorry, I couldn’t find an answer.");
                }
            } catch (error: any) {
                showAlert("Error", error.message || "Something went wrong.", "", { type: "error" });
                setAnswer("Sorry, something went wrong.");
            } finally {
                // Automatically move to the next step after 2 seconds
                setTimeout(() => {
                    triggerNextStep();
                }, 2000);
            }
    }
    useEffect(() => {triggerSendQuestion()}, [previousStep, answer])

    return <div>{answer}</div>;
};

const CustomHeader = ({ toggleChat, resetChat }: { 
    toggleChat: () => void, 
    resetChat: () => void 
}) => (
    <div className="custom-chat-header">
        <span>EmpRoster Assistant</span>
        <div className="custom-chat-header-btns-grp">
            <FiRefreshCw 
                className="chatbot-header-btn" 
                onClick={resetChat}
            />
            <IoClose 
                className="chatbot-header-close-box" 
                onClick={toggleChat} 
            />
        </div>
    </div>
);

const EmpRosterChat = () => {
    const [ showChat, setShowChat ] = useState(false);
    const [ chatKey, setChatKey ] = useState(0);
    const location = useLocation()
    const isOnLanding = location.pathname.includes('home');
    const isOnLogin = location.pathname.includes('login');
    const isOnRegister = location.pathname.includes('register');
    const isOnReqResetEmail = location.pathname.includes('request-reset-pw-email');
    const isOnResetPw = location.pathname.includes('reset-pw');
    const isOnPreviewLanding = location.pathname.includes('preview-landing-page');


    const steps = [
        {
            id: '1',
            message: `Welcome to EmpRoster. We are from FYP-25-S1-12. What can I help you? (^_^)`,
            trigger: 'user_input',
        },
        {
            id: 'user_input',
            user: true,
            trigger: 'processing',
        },
        {
            id: 'processing',
            component: <ApiResponse />,
            asMessage: true,
            waitAction: true,
            trigger: 'other-question',
        },
        {
            id: 'other-question',
            options: [
                { value: 'yes', label: 'Yes', trigger: 'update-yes' },
                { value: 'no', label: 'No', trigger: 'end-message' },
            ],
        },
        {
            id: 'update-yes',
            message: 'How can I help you with?',
            trigger: 'user_input',
        },
        {
            id: 'end-message',
            message: 'Thanks! Have a nice day (^_^)',
            end: true,
        },
    ];

    function toggleShowChatBox() {
        setShowChat(!showChat);
    }

    function resetChat(){
        setChatKey(prev => prev + 1);
    };

    if (!showChat 
        && !isOnLanding
        && !isOnLogin
        && !isOnRegister
        && !isOnReqResetEmail
        && !isOnResetPw 
        && !isOnPreviewLanding
    ) {
        return (
            <button 
                className={`chatbot-toggle ${showChat ? 'open' : ''}`}
                onClick={toggleShowChatBox}
            >
                {!showChat  
                    ? <BsChatLeftDotsFill className="chatbot-toggle-icon"/> 
                    : <></>
                }
            </button>
        );
    }

    return (
        <>
        {!isOnLanding
         && !isOnLogin
         && !isOnRegister
         && !isOnReqResetEmail
         && !isOnResetPw 
         && !isOnPreviewLanding 
         && (
            <div className="custom-chat-container">
                {/* Your custom header */}
                <CustomHeader 
                    toggleChat={() => toggleShowChatBox()}
                    resetChat={() => resetChat()}
                />
                
                {/* The actual chatbot */}
                <ChatBot
                    key={chatKey}
                    steps={steps}
                    hideHeader={true}
                    recognitionEnable={true}

                />
            </div>
        )}
        </>
    );
}

export default EmpRosterChat;
