import { useEffect, useState } from 'react';
import './EmployerVideoCall.scss';

function EmployerVideoCall() {
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [callStatus, setCallStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCallHandled, setIsCallHandled] = useState(false);

    const role = 'employer';

    useEffect(() => {
        const initializeClient = async () => {
            try {
                await import('https://cdn.stringee.com/sdk/web/latest/stringee-web-sdk.min.js');
                console.log('StringeeUtil.isWebRTCSupported: ' + StringeeUtil.isWebRTCSupported());

                if (window.StringeeClient) {
                    const newClient = new window.StringeeClient();
                    setClient(newClient);
                    console.log('newClient: ', newClient);

                    const tokenUrl = 'https://final-joblink-backend.onrender.com/getAccessTokenForEmployer';

                    if (!role) {
                        console.error('Role is not defined');
                        return;
                    }

                    const response = await fetch(tokenUrl);
                    const data = await response.json();

                    const formattedRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Unknown';
                    console.log(`${formattedRole} Access Token:`, data.accessToken);

                    newClient.connect(data.accessToken);

                    newClient.on('connect', function () {
                        setIsConnected(true);
                        setLoading(false);
                        console.log('connected');
                    });

                    newClient.on('authen', response => console.log('Authenticated:', response));
                    newClient.on('disconnect', () => {
                        setIsConnected(false);
                        console.log('disconnected');
                    });

                    newClient.on('requestnewtoken', async () => {
                        const newResponse = await fetch(tokenUrl);
                        const newData = await newResponse.json();
                        console.log(`${formattedRole} New Access Token:`, newData.accessToken);
                        newClient.connect(newData.accessToken);
                    });

                    newClient.on('incomingcall2', function (incomingcall) {
                        if (isCallHandled) return;
                        setIsCallHandled(true);
                        console.log('incomingcall', incomingcall);
                        setCall(incomingcall);
                        settingCallEvent(incomingcall);

                        var answer = confirm('Lời mời tham gia phỏng vấn từ ' + incomingcall.fromNumber + ', xác nhận tham gia?');
                        if (answer) {
                            incomingcall.answer(function (res) {
                                console.log('answer res', res);
                            });
                        } else {
                            incomingcall.reject(function (res) {
                                console.log('reject res', res);
                            });
                        }
                    });

                } else {
                    console.error('Stringee SDK chưa được tải');
                }
            } catch (error) {
                console.error('Lỗi khi tải SDK Stringee:', error);
            }
        };

        if (document.readyState === 'complete') {
            initializeClient();
        } else {
            window.addEventListener('load', initializeClient);
            return () => window.removeEventListener('load', initializeClient);
        }
    }, [role, isCallHandled]);

    const onstop = () => {
        console.log("Call ended. Cleaning up...");
        if (call) {
            call.hangup();
        }
        setCallStatus('Call Ended');
        setIsCallHandled(false);
    };

    const settingCallEvent = (call1) => {
        call1.on('addlocaltrack', function (localtrack1) {
            console.log('addlocaltrack', localtrack1);

            var element = localtrack1.attach();
            document.getElementById("local_videos").appendChild(element);
            element.style.height = "150px";
            element.style.color = "red";
        });

        call1.on('addremotetrack', function (track) {
            var element = track.attach();
            document.getElementById("remote_videos").appendChild(element);
            element.style.width = "120%";  
            element.style.height = "120%"; 
            element.style.objectFit = "contain";
        });

        call1.on('removeremotetrack', function (track) {
            track.detachAndRemove();
        });

        call1.on('removelocaltrack', function (track) {
            track.detachAndRemove();
        });

        call1.on('signalingstate', function (state) {
            console.log('signalingstate ', state);
            if (state.code === 6) {
                setCallStatus('Ended');
                onstop();
            } else if (state.code === 3) {
                setCallStatus('Answered');
            } else if (state.code === 5) {
                setCallStatus('User busy');
                onstop();
            }
        });

        call1.on('mediastate', function (state) {
            console.log('mediastate ', state);
        });
    };

    return (
        <div className="video-call-container">
            {/* Phần Header */}
            <div className="header">
                <h1>Video Call</h1>
                {loading && <p>Connecting...</p>}
            </div>

            {/* Phần Video Call */}
            <div className="video-call-body">
                <div className="video-container">
                    {/* Remote Video (Video đối phương) */}
                    <div className="video-box remote-video" id='box'>
                        <div className="video-label"></div>
                        <div id="remote_videos"></div>
                    </div>

                    {/* Local Video (Video của người dùng) */}
                    <div className="video-box local-video">
                        <div className="video-label">Bạn</div>
                        <div id="local_videos"></div>
                    </div>
                </div>

                <div className="call-actions">
                    {callStatus && (
                        <div className={`call-status ${callStatus.toLowerCase().replace(' ', '-')}`}>
                            {callStatus}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EmployerVideoCall;
