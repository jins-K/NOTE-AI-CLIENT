import React from 'react';
import {useParams} from 'react-router-dom';
import Card from '../components/Card';

const FeedbackDetail: React.FC = () => {
    const { id } = useParams();

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Card title={`Feedback Detail ${id}`}>
                <p>Details for feedback ID: {id} will be displayed here.</p>
            </Card>
        </div>
    )
}

export default FeedbackDetail;