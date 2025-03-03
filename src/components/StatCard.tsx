import React from 'react';
import { Cards, Box } from '@cloudscape-design/components';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, color }) => {
    return (
        <Cards
            items={[{ title, value, subtitle, color }]}
            cardDefinition={{
                header: (item: StatCardProps) => (
                    <Box variant="container" padding="s" textAlign="center">
                        <Box
                            fontSize="display-l"
                            fontWeight="bold"
                            padding={{ bottom: 's' }}
                        >
                            <span style={{ color: item.color }}>{item.value}</span>
                        </Box>
                        <Box
                            color="text-body-secondary"
                            fontSize="heading-s"
                            padding={{ bottom: 'xs' }}
                        >
                            {item.subtitle}
                        </Box>
                        <Box fontSize="heading-m">

                            {item.title}

                        </Box>
                    </Box>
                ),
                sections: []
            }}
        />
    );
};

export default StatCard; 