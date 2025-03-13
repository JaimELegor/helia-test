import { useState, useEffect, useCallback } from 'react';
import { useHelia } from '@/hooks/useHelia';

const TOPIC = 'cid-sharing'; // Define a pubsub topic

export const usePubSub = () => {
  const { libp2p } = useHelia();
  const [messages, setMessages] = useState([]);

  // Function to send a CID to the topic
  const sendCID = useCallback(async (cid) => {
    const peers = await libp2p.peerStore.all();
    console.log('Connected peers:', peers);
    console.log("libp2p service: ", libp2p.services.pubsub)
    if (!libp2p?.services.pubsub) return;
    console.log("Trying to send CID...")
    try {
      const message = JSON.stringify({ cid, timestamp: Date.now() });
      await libp2p.services.pubsub.publish(TOPIC, new TextEncoder().encode(message));
      console.log('Sent CID:', cid);
    } catch (err) {
      console.error('Failed to send CID:', err);
    }
  }, [libp2p]);

  // Function to subscribe to CID messages
  useEffect(() => {
    if (!libp2p?.services.pubsub) return;
    console.log("Subscribing...")

    const onMessage = (msg) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(msg.data));
        console.log('Received CID:', data.cid);
        setMessages((prev) => [...prev, data.cid]);
      } catch (err) {
        console.error('Error decoding CID message:', err);
      }
    };

    libp2p.services.pubsub.subscribe(TOPIC, onMessage);
    console.log('PubSub subscriptions:', libp2p.services.pubsub.getTopics());
    return () => {
      libp2p.services.pubsub.unsubscribe(TOPIC, onMessage);
    };
  }, [libp2p]);

  return { sendCID, messages };
};
