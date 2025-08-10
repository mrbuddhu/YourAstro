import React, { useState, useEffect, useRef } from 'react';

const Index = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedAstrologer, setSelectedAstrologer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en'); // 'en' or 'hi'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    horoscopeName: '',
    horoscopeDate: ''
  });

  // Real-time communication states
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [connectionState, setConnectionState] = useState('disconnected');
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // WebRTC refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const chatContainerRef = useRef(null);
  const callIntervalRef = useRef(null);

  // Language content
  const content = {
    en: {
      brand: "YourAstro",
      tagline: "✨ Professional Astrology Platform ✨",
      hero: {
        title: "Professional Astrology",
        subtitle: "Consultations",
        description: "Connect with certified astrologers for personalized insights and guidance on your life's journey",
        startConsultation: "Start Consultation",
        dailyHoroscope: "Daily Horoscope"
      },
      stats: {
        clients: "Happy Clients",
        astrologers: "Expert Astrologers", 
        rating: "Average Rating"
      },
      experts: {
        title: "Meet Our Experts",
        subtitle: "Connect with professional astrologers from around the world"
      },
      services: {
        title: "Our Services",
        subtitle: "Choose the consultation format that works best for you",
        chat: "Chat Session",
        voice: "Voice Call", 
        video: "Video Session"
      },
      nav: {
        signin: "Sign In",
        getStarted: "Get Started",
        logout: "Sign Out",
        welcome: "Welcome"
      },
      modal: {
        login: "Sign In",
        signup: "Create Account",
        consultation: "Start Consultation",
        horoscope: "Daily Horoscope"
      }
    },
    hi: {
      brand: "YourAstro",
      tagline: "🙏 पेशेवर ज्योतिष मंच 🙏",
      hero: {
        title: "पेशेवर ज्योतिष",
        subtitle: "परामर्श",
        description: "प्रामाणिक ज्योतिषियों से जुड़ें और अपने जीवन की राह में व्यक्तिगत मार्गदर्शन पाएं",
        startConsultation: "परामर्श शुरू करें",
        dailyHoroscope: "दैनिक राशिफल"
      },
      stats: {
        clients: "खुश ग्राहक",
        astrologers: "विशेषज्ञ ज्योतिषी",
        rating: "औसत रेटिंग"
      },
      experts: {
        title: "हमारे विशेषज्ञ",
        subtitle: "दुनिया भर के पेशेवर ज्योतिषियों से जुड़ें"
      },
      services: {
        title: "हमारी सेवाएं",
        subtitle: "अपनी सुविधा के अनुसार परामर्श का तरीका चुनें",
        chat: "चैट परामर्श",
        voice: "वॉइस कॉल",
        video: "वीडियो सेशन"
      },
      nav: {
        signin: "लॉगिन करें",
        getStarted: "शुरुआत करें", 
        logout: "बाहर निकलें",
        welcome: "नमस्कार"
      },
      modal: {
        login: "लॉगिन करें",
        signup: "खाता बनाएं",
        consultation: "परामर्श शुरू करें",
        horoscope: "दैनिक राशिफल"
      }
    }
  };

  const t = content[language];

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  // Check if user is logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('yourastro_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Call duration timer
  useEffect(() => {
    let interval = null;
    if (isInCall && isConnected) {
      interval = setInterval(() => {
        setCallDuration(duration => duration + 1);
      }, 1000);
    } else if (!isInCall) {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isInCall, isConnected]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-fade-in-up');
            }, index * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = document.querySelectorAll('.fade-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const showToast = (title, description, type = 'success') => {
    const toastElement = document.createElement('div');
    toastElement.className = `fixed top-6 right-6 z-50 p-4 rounded-xl backdrop-blur-xl text-white max-w-sm border animate-fade-in-up ${
      type === 'error' 
        ? 'bg-red-500/10 border-red-500/20' 
        : 'bg-yellow-500/10 border-yellow-500/20'
    }`;
    
    toastElement.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="text-xl">${type === 'error' ? '⚠️' : '✨'}</div>
        <div>
          <div class="font-semibold">${title}</div>
          <div class="text-sm opacity-80 mt-1">${description}</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(toastElement);
    setTimeout(() => {
      toastElement.style.opacity = '0';
      setTimeout(() => toastElement.remove(), 300);
    }, 4000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const { email, password } = formData;
      if (email === 'test@example.com' && password === 'password') {
        const loggedInUser = { email, fullName: language === 'hi' ? 'राजेश कुमार' : 'Rajesh Kumar' };
        setUser(loggedInUser);
        localStorage.setItem('yourastro_user', JSON.stringify(loggedInUser));
        showToast(
          language === 'hi' ? 'सफल लॉगिन!' : 'Login Successful!', 
          language === 'hi' ? 'आपका स्वागत है!' : 'Welcome back!'
        );
        closeModal();
      } else {
        showToast(
          language === 'hi' ? 'लॉगिन त्रुटि' : 'Login Failed', 
          language === 'hi' ? 'कृपया अपना ईमेल और पासवर्ड जांचें' : 'Please check your email and password', 
          'error'
        );
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const { email, password, fullName } = formData;
      if (email && password && fullName) {
        const newUser = { email, fullName };
        setUser(newUser);
        localStorage.setItem('yourastro_user', JSON.stringify(newUser));
        showToast(
          language === 'hi' ? 'खाता बनाया गया!' : 'Account Created!', 
          language === 'hi' ? 'YourAstro में आपका स्वागत है' : 'Welcome to YourAstro'
        );
        closeModal();
      } else {
        showToast(
          language === 'hi' ? 'जानकारी अधूरी' : 'Missing Information', 
          language === 'hi' ? 'कृपया सभी फील्ड भरें' : 'Please fill all fields', 
          'error'
        );
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('yourastro_user');
    showToast(
      language === 'hi' ? 'लॉगआउट सफल' : 'Logged Out', 
      language === 'hi' ? 'सफलतापूर्वक लॉगआउट' : 'Successfully logged out'
    );
  };

  const handleStartConsultation = () => {
    if (!user) {
      showToast(
        language === 'hi' ? 'लॉगिन आवश्यक' : 'Login Required', 
        language === 'hi' ? 'परामर्श के लिए लॉगिन करें' : 'Please login to start consultation', 
        'error'
      );
      setModalType('login');
      setShowModal(true);
      return;
    }
    setModalType('consultation');
    setShowModal(true);
  };

  const handleDailyHoroscope = () => {
    setModalType('horoscope');
    setShowModal(true);
  };

  const handleAstrologerClick = (astrologer) => {
    setSelectedAstrologer(astrologer);
    setModalType('astrologer');
    setShowModal(true);
  };

  const handleServiceClick = (service) => {
    if (!user) {
      showToast(
        language === 'hi' ? 'लॉगिन आवश्यक' : 'Login Required', 
        language === 'hi' ? 'सेवा बुक करने के लिए लॉगिन करें' : 'Please login to book service', 
        'error'
      );
      setModalType('login');
      setShowModal(true);
      return;
    }
    setModalType('service');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAstrologer(null);
    setFormData({
      email: '',
      password: '',
      fullName: '',
      horoscopeName: '',
      horoscopeDate: ''
    });
    if (isInCall) {
      endCall();
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGetHoroscope = (e) => {
    e.preventDefault();
    if (!formData.horoscopeName || !formData.horoscopeDate) {
      showToast(
        language === 'hi' ? 'जानकारी अधूरी' : 'Missing Information', 
        language === 'hi' ? 'नाम और जन्मतिथि दें' : 'Please provide name and birth date', 
        'error'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      showToast(
        language === 'hi' ? 'राशिफल तैयार!' : 'Horoscope Ready!', 
        language === 'hi' ? `${formData.horoscopeName} का राशिफल तैयार है` : `Horoscope for ${formData.horoscopeName} is ready`
      );
      setIsLoading(false);
      closeModal();
    }, 2000);
  };

  const handleBookConsultation = (type) => {
    setIsLoading(true);
    setTimeout(() => {
      if (type === 'chat') {
        startChat();
      } else if (type === 'voice') {
        startCall('audio');
      } else if (type === 'video') {
        startCall('video');
      }
      showToast(
        language === 'hi' ? 'परामर्श शुरू!' : 'Session Started!', 
        language === 'hi' ? `आपका ${type} परामर्श सक्रिय है` : `Your ${type} consultation is now active`
      );
      setIsLoading(false);
    }, 1000);
  };

  const startChat = () => {
    setModalType('activeChat');
    setShowModal(true);
    setChatMessages([
      { 
        id: 1, 
        sender: 'astrologer', 
        message: language === 'hi' ? 
          'नमस्कार! आज आपसे बात करके खुशी हुई। मैं आपकी सहायता के लिए यहां हूं।' :
          'Hello! I\'m delighted to connect with you today. How can I help you?', 
        timestamp: new Date() 
      }
    ]);

    setTimeout(() => {
      addAstrologerMessage();
    }, 2500);
  };

  const addAstrologerMessage = (message) => {
    const responses = language === 'hi' ? [
      "आपके चारों ओर सकारात्मक ऊर्जा दिख रही है। किस विषय में मार्गदर्शन चाहिए?",
      "ग्रहों की स्थिति आगे अच्छे समय का संकेत दे रही है। अपनी समस्या बताएं।",
      "आपकी ऊर्जा बताती है कि आप सही दिशा में हैं। और क्या जानना चाहते हैं?",
      "तारे आपके लिए नए अवसर लेकर आ रहे हैं। तैयार रहें।",
      "आपकी जन्म तारीख बताइए, मैं आपकी कुंडली देखूंगा।",
      "आपके भविष्य में सुख और समृद्धि के योग हैं।"
    ] : [
      "I sense positive energy around you. What area would you like guidance on?",
      "The planetary alignments suggest good times ahead. Tell me more.",
      "Your energy indicates you're on the right path. What else would you like to know?",
      "The stars are bringing new opportunities your way. Stay prepared.",
      "Please share your birth details so I can analyze your chart.",
      "I see prosperity and happiness in your future path."
    ];

    const selectedResponse = message || responses[Math.floor(Math.random() * responses.length)];
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'astrologer',
      message: selectedResponse,
      timestamp: new Date(),
      status: 'delivered'
    }]);
  };

  // Real-time chat functions
  const [isAstrologerTyping, setIsAstrologerTyping] = useState(false);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      message: newMessage,
      timestamp: new Date(),
      status: 'sending'
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate message delivery
    setTimeout(() => {
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'delivered' }
            : msg
        )
      );
      
      // Show typing indicator
      setIsAstrologerTyping(true);
      
      // Astrologer responds after user message
      setTimeout(() => {
        setIsAstrologerTyping(false);
        addAstrologerMessage();
      }, 1500 + Math.random() * 2000);
    }, 500);
  };



  const startCall = async (type) => {
    setCallType(type);
    setIsInCall(true);
    setModalType('activeCall');
    setShowModal(true);
    setConnectionState('connecting');

    try {
      // Set up peer connection configuration with STUN servers
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };

      // Create peer connection
      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      // Set up connection state monitoring
      peerConnection.onconnectionstatechange = () => {
        setConnectionState(peerConnection.connectionState);
        if (peerConnection.connectionState === 'connected') {
          setIsConnected(true);
          showToast(
            language === 'hi' ? 'कनेक्शन सफल!' : 'Connected!', 
            language === 'hi' ? 'ज्योतिषी से जुड़ाव हो गया' : 'Successfully connected to astrologer'
          );
        }
      };

      // Handle incoming streams
      peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams;
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      };

      // Get user media
      const constraints = {
        audio: true,
        video: type === 'video'
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Start call duration counter
      callIntervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      // Simulate connection for demo (in real app, this would be handled by signaling server)
      setTimeout(() => {
        setIsConnected(true);
        setConnectionState('connected');
        simulateRemoteStream();
        showToast(
          language === 'hi' ? 'कनेक्शन सफल!' : 'Connected!', 
          language === 'hi' ? 'ज्योतिषी से जुड़ाव हो गया' : 'Successfully connected to astrologer'
        );
      }, 3000);

    } catch (error) {
      console.error('Error starting call:', error);
      showToast(
        language === 'hi' ? 'कनेक्शन त्रुटि' : 'Connection Error', 
        language === 'hi' ? 'कैमरा/माइक एक्सेस नहीं मिला' : 'Could not access camera/microphone', 
        'error'
      );
      endCall();
    }
  };

  const simulateRemoteStream = () => {
    if (remoteVideoRef.current && callType === 'video') {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');

      const drawAvatar = () => {
        // Dark background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(0.5, '#1a1a1a');
        gradient.addColorStop(1, '#000000');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Yellow circle
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(160, 120, 40, 0, Math.PI * 2);
        ctx.fill();

        // Star symbol
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 24px serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨', canvas.width / 2, canvas.height / 2 + 8);

        // Text
        ctx.fillStyle = '#ffd700';
        ctx.font = '16px Inter';
        ctx.fillText(language === 'hi' ? 'ज्योतिषी जी' : 'Astrologer', canvas.width / 2, canvas.height / 2 + 60);
      };

      drawAvatar();
      const stream = canvas.captureStream();
      remoteVideoRef.current.srcObject = stream;
    }
  };

  const endCall = () => {
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Clear call timer
    if (callIntervalRef.current) {
      clearInterval(callIntervalRef.current);
      callIntervalRef.current = null;
    }

    setIsInCall(false);
    setIsConnected(false);
    setCallType('');
    setCallDuration(0);
    setConnectionState('disconnected');
    setIsMuted(false);
    setIsVideoEnabled(true);
    setIsScreenSharing(false);
    closeModal();
    showToast(
      language === 'hi' ? 'कॉल समाप्त' : 'Call Ended', 
      language === 'hi' ? 'सेशन सफलतापूर्वक समाप्त' : 'Session completed successfully'
    );
  };

  // Call control functions
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        // Replace video track in peer connection
        if (peerConnectionRef.current && localStreamRef.current) {
          const sender = peerConnectionRef.current.getSenders().find(
            s => s.track && s.track.kind === 'video'
          );
          if (sender) {
            await sender.replaceTrack(screenStream.getVideoTracks()[0]);
          }
        }

        // Update local video display
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        setIsScreenSharing(true);
        
        // Listen for screen share end
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          // Switch back to camera
          if (localStreamRef.current && localVideoRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
          }
        };

      } else {
        // Stop screen sharing and return to camera
        if (localStreamRef.current && localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
      showToast(
        language === 'hi' ? 'स्क्रीन शेयर त्रुटि' : 'Screen Share Error',
        language === 'hi' ? 'स्क्रीन शेयर नहीं कर सकते' : 'Could not share screen',
        'error'
      );
    }
  };

  const formatCallDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleBookService = () => {
    setIsLoading(true);
    setTimeout(() => {
      showToast(
        language === 'hi' ? 'सेवा बुक हुई!' : 'Service Booked!', 
        language === 'hi' ? 'आपका परामर्श शेड्यूल हो गया' : 'Your consultation has been scheduled'
      );
      setIsLoading(false);
      closeModal();
    }, 1000);
  };

  const astrologers = [
    { 
      name: language === 'hi' ? "पंडित राज शर्मा" : "Pandit Raj Sharma", 
      experience: 25, 
      rating: 4.9, 
      isOnline: true, 
      specialty: language === 'hi' ? "वैदिक ज्योतिष" : "Vedic Astrology", 
      location: language === 'hi' ? "वाराणसी" : "Varanasi" 
    },
    { 
      name: language === 'hi' ? "आचार्या प्रिया गुप्ता" : "Acharya Priya Gupta", 
      experience: 18, 
      rating: 4.8, 
      isOnline: true, 
      specialty: language === 'hi' ? "टैरो रीडिंग" : "Tarot Reading", 
      location: language === 'hi' ? "दिल्ली" : "Delhi" 
    },
    { 
      name: language === 'hi' ? "गुरु विनोद आर्य" : "Guru Vinod Arya", 
      experience: 22, 
      rating: 4.9, 
      isOnline: false, 
      specialty: language === 'hi' ? "कुंडली विश्लेषण" : "Kundli Analysis", 
      location: language === 'hi' ? "जयपुर" : "Jaipur" 
    },
    { 
      name: language === 'hi' ? "डॉ. अमित द्विवेदी" : "Dr. Amit Dwivedi", 
      experience: 15, 
      rating: 4.7, 
      isOnline: true, 
      specialty: language === 'hi' ? "नुमेरोलॉजी" : "Numerology", 
      location: language === 'hi' ? "लखनऊ" : "Lucknow" 
    }
  ];

  const services = [
    { 
      title: t.services.chat,
      description: language === 'hi' ? "विशेषज्ञों के साथ टेक्स्ट परामर्श" : "Text-based consultation with experts", 
      price: "₹50", 
      duration: language === 'hi' ? "/15मिनट" : "/15min",
      features: language === 'hi' ? ["तुरंत जवाब", "लिखित रिकॉर्ड", "फॉलो-अप"] : ["Instant responses", "Written record", "Follow-up"],
      emoji: "💬"
    },
    { 
      title: t.services.voice,
      description: language === 'hi' ? "व्यक्तिगत वॉइस परामर्श" : "Personal voice consultation", 
      price: "₹100", 
      duration: language === 'hi' ? "/15मिनट" : "/15min",
      features: language === 'hi' ? ["सीधी बातचीत", "व्यक्तिगत मार्गदर्शन", "विस्तृत समाधान"] : ["Direct conversation", "Personal guidance", "Detailed solutions"],
      emoji: "📞"
    },
    { 
      title: t.services.video,
      description: language === 'hi' ? "आमने-सामने वीडियो परामर्श" : "Face-to-face video consultation", 
      price: "₹150", 
      duration: language === 'hi' ? "/15मिनट" : "/15min",
      features: language === 'hi' ? ["दृश्य संपर्क", "व्यक्तित्व विश्लेषण", "प्रीमियम अनुभव"] : ["Visual connection", "Personality analysis", "Premium experience"],
      emoji: "📹"
    }
  ];
  
  return (
    <div className="min-h-screen cosmic-bg text-white font-['Inter']">
      
      {/* Floating Cosmic Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 cosmic-orb rounded-full opacity-20 floating-element"></div>
        <div className="absolute top-40 right-20 w-24 h-24 cosmic-orb rounded-full opacity-15 floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 cosmic-orb rounded-full opacity-10 floating-element" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 cosmic-orb rounded-full opacity-25 floating-element" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 cosmic-orb rounded-full opacity-5 floating-element" style={{animationDelay: '3s'}}></div>
      </div>
      
      {/* Navigation */}
      <nav className="cosmic-nav sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 fade-on-scroll">
              <div className="w-12 h-12 cosmic-orb rounded-xl flex items-center justify-center shadow-lg floating-element">
                <span className="text-white font-bold text-xl">◈</span>
              </div>
              <div>
                <span className="font-['Manrope'] font-bold text-3xl text-cosmic-gradient">{t.brand}</span>
                <div className="text-xs text-cosmic-bright font-medium">{t.tagline}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="language-cosmic px-4 py-2 rounded-lg text-sm font-medium text-cosmic-bright hover:text-purple-300 transition-all"
              >
                {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
              </button>

              {user ? (
                <div className="flex items-center gap-4 fade-on-scroll">
                  <div className="cosmic-card px-6 py-3 rounded-xl">
                    <span className="text-purple-200 text-sm">
                      {t.nav.welcome}, {user.fullName}
                    </span>
                  </div>
                  <button
                    className="cosmic-outline px-6 py-3 rounded-xl text-sm font-medium transition-all"
                    onClick={handleLogout}
                  >
                    {t.nav.logout}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4 fade-on-scroll">
                  <button
                    className="text-yellow-200 hover:text-yellow-100 px-6 py-3 text-sm font-medium transition-colors"
                    onClick={() => {
                      setModalType('login');
                      setShowModal(true);
                    }}
                  >
                    {t.nav.signin}
                  </button>
                  <button
                    className="cosmic-button px-6 py-3 text-white text-sm font-bold rounded-xl"
                    onClick={() => {
                      setModalType('signup');
                      setShowModal(true);
                    }}
                  >
                    {t.nav.getStarted}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="fade-on-scroll">
            {/* Decorative Elements */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-6 text-4xl">
                <span className="animate-subtle-float text-purple-400">◆</span>
                <span className="animate-subtle-float text-purple-300" style={{animationDelay: '0.5s'}}>●</span>
                <span className="animate-subtle-float text-purple-400" style={{animationDelay: '1s'}}>🔮</span>
                <span className="animate-subtle-float text-purple-300" style={{animationDelay: '1.5s'}}>●</span>
                <span className="animate-subtle-float text-purple-400" style={{animationDelay: '2s'}}>◆</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-['Manrope'] font-bold mb-8 leading-tight">
              <span className="text-cosmic-bright">{t.hero.title}</span>
              <br />
              <span className="text-cosmic-gradient">{t.hero.subtitle}</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              {t.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button
                className="cosmic-button px-10 py-5 text-white text-lg font-bold rounded-2xl flex items-center gap-3"
                onClick={handleStartConsultation}
              >
                ◈ {t.hero.startConsultation}
              </button>

              <button
                className="cosmic-outline px-10 py-5 text-lg font-bold rounded-2xl flex items-center gap-3"
                onClick={handleDailyHoroscope}
              >
                ◆ {t.hero.dailyHoroscope}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { value: language === 'hi' ? "5 लाख+" : "500K+", label: t.stats.clients, emoji: "👥" },
                { value: language === 'hi' ? "200+" : "200+", label: t.stats.astrologers, emoji: "✨" },
                { value: "4.9/5", label: t.stats.rating, emoji: "⭐" }
              ].map((stat, index) => (
                <div key={index} className="cosmic-card rounded-2xl p-8 fade-on-scroll" style={{animationDelay: `${index * 0.2}s`}}>
                  <div className="text-4xl mb-4">{stat.emoji}</div>
                  <div className="text-3xl font-bold text-cosmic-gradient mb-2">{stat.value}</div>
                  <div className="text-gray-300 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
            </div>
          </div>
        </section>
        
      {/* Astrologers Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-on-scroll">
            <div className="text-3xl mb-4">⭐ ✨ 🔮 ✨ ⭐</div>
            <h2 className="text-4xl md:text-6xl font-['Manrope'] font-bold mb-6 text-yellow-bright">
              {t.experts.title}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.experts.subtitle}
              </p>
            </div>
            
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {astrologers.map((astrologer, index) => (
              <div
                key={index}
                className="cosmic-card rounded-2xl p-6 cursor-pointer fade-on-scroll relative overflow-hidden"
                style={{animationDelay: `${index * 0.1}s`}}
                onClick={() => handleAstrologerClick(astrologer)}
              >
                {/* Yellow accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 yellow-gradient"></div>
                
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full cosmic-orb flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">◈</span>
                  </div>

                  <h3 className="font-bold text-lg mb-2 text-cosmic-gradient">{astrologer.name}</h3>
                  <p className="text-purple-300 text-sm mb-2">
                    {astrologer.experience} {language === 'hi' ? 'साल अनुभव' : 'years experience'}
                  </p>
                  <p className="text-purple-400 text-sm font-semibold mb-3">{astrologer.specialty}</p>
                  <p className="text-gray-400 text-xs mb-4">📍 {astrologer.location}</p>

                  <div className="flex items-center justify-center gap-1 mb-4">
                    <span className="text-purple-400 text-lg">⭐</span>
                    <span className="text-white text-sm font-bold">{astrologer.rating}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div className={`w-3 h-3 rounded-full ${astrologer.isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className={`text-xs font-medium ${astrologer.isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                      {astrologer.isOnline ? 
                        (language === 'hi' ? 'उपलब्ध' : 'Available') : 
                        (language === 'hi' ? 'व्यस्त' : 'Busy')
                      }
                    </span>
                  </div>

                  <button className="w-full py-3 cosmic-button text-white text-sm font-bold rounded-xl">
                    {astrologer.isOnline ? 
                      (language === 'hi' ? '✨ अभी बात करें' : '✨ Connect Now') : 
                      (language === 'hi' ? '📅 समय बुक करें' : '📅 Schedule')
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-on-scroll">
            <div className="text-3xl mb-4">💬 📞 📹</div>
            <h2 className="text-4xl md:text-6xl font-['Manrope'] font-bold mb-6 text-yellow-bright">
              {t.services.title}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.services.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="cosmic-card rounded-2xl p-8 cursor-pointer fade-on-scroll relative overflow-hidden"
                style={{animationDelay: `${index * 0.15}s`}}
                onClick={() => handleServiceClick(service)}
              >
                <div className="text-center">
                  <div className="text-6xl mb-6 animate-subtle-float">{service.emoji}</div>

                  <h3 className="font-['Manrope'] font-bold text-2xl mb-4 text-cosmic-gradient">
                    {service.title}
                  </h3>

                  <p className="text-gray-300 mb-6 text-base leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-yellow-bright">
                      {service.price}
                    </span>
                    <span className="text-purple-300 text-sm">{service.duration}</span>
                  </div>

                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-gray-300 text-sm">
                        <span className="text-purple-400">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-4 cosmic-button text-white font-bold rounded-xl">
                    {language === 'hi' ? '✨ अभी बुक करें' : '✨ Book Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="dark-nav border-t border-yellow-500/20 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-12 fade-on-scroll">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 cosmic-orb rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">✨</span>
              </div>
              <div>
                <span className="font-['Manrope'] font-bold text-4xl text-cosmic-gradient">{t.brand}</span>
                <div className="text-sm text-purple-300 font-medium">{t.tagline}</div>
              </div>
            </div>

            <p className="text-gray-300 mb-8 max-w-3xl mx-auto text-lg">
              {language === 'hi' ? 
                'भारत का सबसे विश्वसनीय ज्योतिष मंच। अपना भविष्य जानें और सफल बनें।' :
                'India\'s most trusted astrology platform. Discover your future and achieve success.'
              }
            </p>

            <div className="text-2xl mb-8">
              ⭐ ✨ 🔮 ✨ ⭐
            </div>
          </div>

          <div className="border-t border-yellow-500/20 pt-8">
            <p className="text-gray-400 text-sm">
              © 2024 YourAstro. {language === 'hi' ? 'सभी अधिकार सुरक्षित।' : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>

      {/* Modal System */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 animate-fade-in-up">
          <div className={`cosmic-card rounded-2xl p-8 w-full mx-4 shadow-2xl border border-yellow-500/20 ${
            modalType === 'activeCall' ? 'max-w-4xl' :
            modalType === 'activeChat' ? 'max-w-lg' : 'max-w-md'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-['Manrope'] font-bold text-cosmic-gradient">
                {modalType === 'consultation' && `✨ ${t.modal.consultation}`}
                {modalType === 'horoscope' && `⭐ ${t.modal.horoscope}`}
                {modalType === 'astrologer' && `✨ ${language === 'hi' ? 'ज्योतिषी प्रोफाइल' : 'Astrologer Profile'}`}
                {modalType === 'service' && `📱 ${language === 'hi' ? 'सेवा बुक करें' : 'Book Service'}`}
                {modalType === 'login' && `🚪 ${t.modal.login}`}
                {modalType === 'signup' && `📝 ${t.modal.signup}`}
                {modalType === 'activeChat' && `💬 ${language === 'hi' ? 'लाइव चैट' : 'Live Chat'}`}
                {modalType === 'activeCall' && `📞 ${language === 'hi' ? 'लाइव कॉल' : 'Live Call'}`}
              </h2>
              <button
                onClick={closeModal}
                className="text-purple-300 hover:text-yellow-200 text-3xl transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              {modalType === 'consultation' && (
                <div>
                  <p className="text-gray-300 mb-6 text-center">
                    {language === 'hi' ? 'अपना परामर्श का तरीका चुनें:' : 'Choose your consultation type:'}
                  </p>
                  <div className="space-y-4">
                    {[
                      { 
                        type: 'chat', 
                        title: language === 'hi' ? 'चैट परामर्श' : 'Chat Session', 
                        price: '₹50/15' + (language === 'hi' ? 'मिनट' : 'min'), 
                        emoji: '💬' 
                      },
                      { 
                        type: 'voice', 
                        title: language === 'hi' ? 'वॉइस कॉल' : 'Voice Call', 
                        price: '₹100/15' + (language === 'hi' ? 'मिनट' : 'min'), 
                        emoji: '📞' 
                      },
                      { 
                        type: 'video', 
                        title: language === 'hi' ? 'वीडियो सेशन' : 'Video Session', 
                        price: '₹150/15' + (language === 'hi' ? 'मिनट' : 'min'), 
                        emoji: '📹' 
                      }
                    ].map((option) => (
                      <button
                        key={option.type}
                        className="w-full p-4 cosmic-card rounded-xl hover:border-yellow-400/30 transition-all flex items-center justify-between"
                        onClick={() => handleBookConsultation(option.type)}
                        disabled={isLoading}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{option.emoji}</span>
                          <span className="font-semibold text-white">{option.title}</span>
                        </div>
                        <span className="text-cosmic-gradient font-bold">{option.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {modalType === 'horoscope' && (
                <form onSubmit={handleGetHoroscope}>
                  <p className="text-gray-300 mb-6 text-center">
                    {language === 'hi' ? 'अपना व्यक्तिगत राशिफल पाएं:' : 'Get your personalized horoscope:'}
                  </p>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="horoscopeName"
                      placeholder={language === 'hi' ? 'आपका नाम' : 'Your Name'}
                      className="w-full p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-white placeholder-yellow-300 focus:border-yellow-400 focus:outline-none"
                      value={formData.horoscopeName}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="date"
                      name="horoscopeDate"
                      className="w-full p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-white focus:border-yellow-400 focus:outline-none"
                      value={formData.horoscopeDate}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="submit"
                      className="w-full py-4 cosmic-button text-white font-bold rounded-xl"
                      disabled={isLoading}
                    >
                      {isLoading ? 
                        (language === 'hi' ? '⏳ तैयार कर रहे हैं...' : '⏳ Generating...') : 
                        (language === 'hi' ? '⭐ राशिफल पाएं' : '⭐ Get Horoscope')
                      }
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'astrologer' && selectedAstrologer && (
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full cosmic-orb flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-3xl">✨</span>
                  </div>
                  <h3 className="font-bold text-2xl text-cosmic-gradient mb-3">{selectedAstrologer.name}</h3>
                  <p className="text-gray-300 mb-2">
                    {selectedAstrologer.experience} {language === 'hi' ? 'साल का अनुभव' : 'years experience'}
                  </p>
                  <p className="text-purple-400 font-semibold mb-4">{selectedAstrologer.specialty}</p>
                  <p className="text-gray-400 text-sm mb-4">📍 {selectedAstrologer.location}</p>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="text-purple-400 text-xl">⭐</span>
                    <span className="text-white font-bold text-lg">{selectedAstrologer.rating}</span>
                  </div>
                  <button
                    className="w-full py-4 cosmic-button text-white font-bold rounded-xl"
                    onClick={() => handleBookConsultation(selectedAstrologer.isOnline ? 'chat' : 'appointment')}
                    disabled={isLoading}
                  >
                    {isLoading ? 
                      (language === 'hi' ? '⏳ जोड़ रहे हैं...' : '⏳ Connecting...') : 
                      (selectedAstrologer.isOnline ? 
                        (language === 'hi' ? '✨ अभी बात करें' : '✨ Connect Now') : 
                        (language === 'hi' ? '📅 समय बुक करें' : '📅 Schedule')
                      )
                    }
                  </button>
                </div>
              )}

              {modalType === 'service' && (
                <div className="text-center">
                  <div className="text-4xl mb-4">✨</div>
                  <p className="text-gray-300 mb-6">
                    {language === 'hi' ? 'अपनी परामर्श सेवा बुक करें:' : 'Book your consultation service:'}
                  </p>
                  <button
                    className="w-full py-4 cosmic-button text-white font-bold rounded-xl"
                    onClick={handleBookService}
                    disabled={isLoading}
                  >
                    {isLoading ? 
                      (language === 'hi' ? '⏳ बुक कर रहे हैं...' : '⏳ Booking...') : 
                      (language === 'hi' ? '✅ बुकिंग कन्फर्म करें' : '✅ Confirm Booking')
                    }
                  </button>
                </div>
              )}

              {(modalType === 'login' || modalType === 'signup') && (
                <form onSubmit={modalType === 'login' ? handleLogin : handleSignup}>
                  <div className="space-y-4">
                    {modalType === 'signup' && (
                      <input
                        type="text"
                        name="fullName"
                        placeholder={language === 'hi' ? 'पूरा नाम' : 'Full Name'}
                        className="w-full p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-white placeholder-yellow-300 focus:border-yellow-400 focus:outline-none"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    )}
                    <input
                      type="email"
                      name="email"
                      placeholder={language === 'hi' ? 'ईमेल' : 'Email'}
                      className="w-full p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-white placeholder-yellow-300 focus:border-yellow-400 focus:outline-none"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder={language === 'hi' ? 'पासवर्ड' : 'Password'}
                      className="w-full p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-white placeholder-yellow-300 focus:border-yellow-400 focus:outline-none"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="submit"
                      className="w-full py-4 cosmic-button text-white font-bold rounded-xl"
                      disabled={isLoading}
                    >
                      {isLoading ? 
                        (language === 'hi' ? '⏳ प्रक्रिया में...' : '⏳ Processing...') : 
                        (modalType === 'login' ? 
                          (language === 'hi' ? '🚪 लॉगिन करें' : '🚪 Sign In') : 
                          (language === 'hi' ? '📝 खाता बनाएं' : '📝 Create Account')
                        )
                      }
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'activeChat' && (
                <div className="h-96 flex flex-col">
                  <div className="flex items-center gap-3 mb-4 p-4 cosmic-card rounded-xl">
                    <div className="w-12 h-12 cosmic-orb rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">✨</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">
                        {language === 'hi' ? 'ज्योतिषी जी' : 'Astrologer'}
                      </h3>
                      <p className="text-sm text-green-400">
                        {language === 'hi' ? 'ऑनलाइन' : 'Online'}
                      </p>
                    </div>
                  </div>

                  <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-4 cosmic-card rounded-xl mb-4 space-y-3"
                  >
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs p-4 rounded-xl ${
                            msg.sender === 'user'
                              ? 'yellow-gradient text-white'
                              : 'cosmic-card text-white border border-yellow-500/20'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                          <div className={`flex justify-between items-center mt-2 text-xs ${msg.sender === 'user' ? 'text-white/70' : 'text-purple-300'}`}>
                            <span>{msg.timestamp.toLocaleTimeString()}</span>
                            {msg.sender === 'user' && msg.status && (
                              <span className="flex items-center gap-1">
                                {msg.status === 'sending' && '⏳'}
                                {msg.status === 'delivered' && '✓'}
                                {msg.status === 'read' && '✓✓'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isAstrologerTyping && (
                      <div className="flex justify-start">
                        <div className="max-w-xs p-4 rounded-xl cosmic-card text-white border border-yellow-500/20">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <span className="text-xs text-purple-300">
                              {language === 'hi' ? 'ज्योतिषी जी टाइप कर रहे हैं...' : 'Astrologer is typing...'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={sendMessage} className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={language === 'hi' ? 'अपना संदेश टाइप करें...' : 'Type your message...'}
                      className="flex-1 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-white placeholder-yellow-300 focus:border-yellow-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 cosmic-button text-white rounded-xl font-bold"
                    >
                      {language === 'hi' ? 'भेजें' : 'Send'}
                    </button>
                  </form>
                </div>
              )}

              {modalType === 'activeCall' && (
                <div className="w-full max-w-3xl">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-3">
                      {callType === 'video' ? 
                        (language === 'hi' ? '📹 वीडियो कॉल' : '📹 Video Call') : 
                        (language === 'hi' ? '📞 वॉइस कॉल' : '📞 Voice Call')
                      } {language === 'hi' ? 'ज्योतिषी जी के साथ' : 'with Astrologer'}
                    </h3>
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-300">
                      <span className={`flex items-center gap-2 ${isConnected ? 'text-green-400' : 'text-purple-400'}`}>
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></div>
                        {isConnected ? 
                          (language === 'hi' ? 'जुड़ा हुआ' : 'Connected') : 
                          (language === 'hi' ? 'जोड़ रहे हैं...' : 'Connecting...')
                        }
                      </span>
                      {isConnected && (
                        <span className="font-mono text-purple-300">
                          ⏱️ {formatCallDuration(callDuration)}
                        </span>
                      )}
                    </div>
                  </div>

                  {callType === 'video' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="relative">
                        <video
                          ref={localVideoRef}
                          autoPlay
                          muted
                          playsInline
                          className="w-full h-48 bg-black rounded-xl object-cover border-2 border-yellow-500/20"
                        />
                        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                          {language === 'hi' ? 'आप' : 'You'}
                        </div>
                      </div>

                      <div className="relative">
                        <video
                          ref={remoteVideoRef}
                          autoPlay
                          playsInline
                          className="w-full h-48 bg-black rounded-xl object-cover border-2 border-yellow-500/20"
                        />
                        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                          {language === 'hi' ? 'ज्योतिषी जी' : 'Astrologer'}
                        </div>
                        {!isConnected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl">
                            <div className="text-white text-center">
                              <div className="text-4xl mb-3 text-purple-400">✨</div>
                              <p className="font-medium">
                                {language === 'hi' ? 'जोड़ रहे हैं...' : 'Connecting...'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {callType === 'audio' && (
                    <div className="text-center py-12">
                      <div className="w-32 h-32 mx-auto mb-6 rounded-full cosmic-orb flex items-center justify-center shadow-lg">
                        <span className="text-5xl text-white">✨</span>
                      </div>
                      <p className="text-2xl font-bold text-cosmic-gradient">
                        {language === 'hi' ? 'ज्योतिषी जी' : 'Astrologer'}
                      </p>
                      <p className="text-gray-300 mt-2">
                        {language === 'hi' ? 'वॉइस कॉल चल रहा है' : 'Voice call in progress'}
                      </p>
                    </div>
                  )}

                  {/* Call Controls */}
                  <div className="flex flex-wrap justify-center gap-4 mb-6">
                    <button
                      onClick={toggleMute}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        isMuted 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                      } border border-gray-600`}
                    >
                      {isMuted ? '🔇' : '🎤'} {language === 'hi' ? (isMuted ? 'अनम्यूट' : 'म्यूट') : (isMuted ? 'Unmute' : 'Mute')}
                    </button>

                    {callType === 'video' && (
                      <button
                        onClick={toggleVideo}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                          !isVideoEnabled 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                        } border border-gray-600`}
                      >
                        {isVideoEnabled ? '📹' : '📹'} {language === 'hi' ? (isVideoEnabled ? 'वीडियो बंद' : 'वीडियो चालू') : (isVideoEnabled ? 'Stop Video' : 'Start Video')}
                      </button>
                    )}

                    {callType === 'video' && (
                      <button
                        onClick={toggleScreenShare}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                          isScreenSharing 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                        } border border-gray-600`}
                      >
                        🖥️ {language === 'hi' ? (isScreenSharing ? 'स्क्रीन शेयर बंद' : 'स्क्रीन शेयर') : (isScreenSharing ? 'Stop Sharing' : 'Share Screen')}
                      </button>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={endCall}
                      className="px-8 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors flex items-center gap-3 font-bold shadow-lg"
                    >
                      📞 {language === 'hi' ? 'कॉल समाप्त करें' : 'End Call'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
          </div>
  );
};

export default Index;