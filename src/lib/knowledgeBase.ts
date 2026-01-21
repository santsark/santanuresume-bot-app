export type KnowledgeItem = {
    keywords: string[];
    response: string;
};

const knowledgeBase: KnowledgeItem[] = [
    // EXPERIENCE
    {
        keywords: ['experience', 'work', 'job', 'career', 'history'],
        response: "I have over 20 years of experience in Business Technology Strategy, Process Automation, and Risk Management. Currently, I am a Senior Vice President at Bank of America (since Feb 2021), where I manage End User Computing Tools Risk. Previously, I was a Manager at Deloitte, Senior Associate at PwC, and held senior roles at Cognizant and Infosys."
    },
    {
        keywords: ['bank of america', 'boa', 'b of a'],
        response: "At Bank of America, I serve as Senior Vice President (since Feb 2021). I previously held the role of Vice President - Manager Financial Business Support. My focus is on managing End User Computing Tools Risk by developing automated solutions to inventory, govern, and manage risk."
    },
    {
        keywords: ['deloitte'],
        response: "I worked as a Manager at Deloitte (April 2016 - Dec 2017) in Charlotte, NC. I advised the Corporate Operation Risk group of a Top 4 US Bank, helping the client close regulatory concerns, enhancing policies, and performing control testing for EUC tools in critical processes like CCAR and Reg Reporting."
    },
    {
        keywords: ['pwc', 'pricewaterhousecoopers'],
        response: "I was a Senior Associate at PwC (Feb 2015 - Feb 2016). I developed a playbook for a large transformation program involving a legacy mainframe replacement and created a Requirements Management Strategy for an Auto Financing client."
    },
    {
        keywords: ['cognizant'],
        response: "I spent 7 years at Cognizant (Feb 2008 - Feb 2015) as a Senior Manager in the Charlotte area."
    },
    {
        keywords: ['infosys'],
        response: "I started my career at Infosys Limited as a Programmer Analyst, working there for 5 years and 4 months (Nov 2002 - Feb 2008)."
    },

    // SKILLS
    {
        keywords: ['skills', 'expertise', 'competencies'],
        response: "My top skills include Product Management, Professional Services, Coaching & Mentoring, Strategy/Technology Consulting, Business Process Assessment & Automation, and Program Management. I also have expertise in offshore development and strategic planning."
    },
    {
        keywords: ['tech', 'technology', 'tools', 'software'],
        response: "I am certified in Alteryx Designer Core and have expertise in Tableau Desktop. I also specialize in AI/ML in Financial Services and Medallia Customer Experience."
    },

    // EDUCATION & CERTIFICATIONS
    {
        keywords: ['education', 'degree', 'university', 'college', 'school', 'mba'],
        response: "I hold a Master of Business Administration (M.B.A.) in Strategy and Marketing from Duke University - The Fuqua School of Business (2013-2014). I also have a B.E. in Chemical Engineering from Visvesvaraya Technological University (1998-2002)."
    },
    {
        keywords: ['certifications', 'certified', 'certs'],
        response: "I hold several certifications including Alteryx Designer Core Certified, AI/ML in Financial Services, Tableau Desktop Specialist, and Medallia Customer Experience Professional."
    },

    // CONTACT
    {
        keywords: ['contact', 'email', 'reach', 'phone', 'location', 'address'],
        response: "You can reach me at sarkar.santanu@outlook.com or 704-779-8782. I am based in Charlotte, North Carolina (1544 Spring Blossom Trl, Fort Mill SC, 29708)."
    },
    {
        keywords: ['linkedin'],
        response: "You can connect with me on LinkedIn at: www.linkedin.com/in/santanu-sarkar-20306921"
    },

    // GENERAL
    {
        keywords: ['about', 'bg', 'background', 'summary'],
        response: "I am Santanu Sarkar, an Operational Excellence leader in Charlotte, NC. I specialize in strategy development, business process assessment, and technology implementation. I have a strong track record of managing multidisciplinary teams to achieve business goals across geographies."
    },
    {
        keywords: ['hello', 'hi', 'hey', 'start', 'greeting'],
        response: "Hello! I'm Santanu Sarkar's AI assistant. I can answer questions about his 20+ years of experience in Business Technology Strategy, his work at Bank of America, Deloitte, and PwC, or his skills in automation and risk management. How can I assist you?"
    }
];

export async function queryKnowledgeBase(query: string): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const lowerQuery = query.toLowerCase();

    // Simple keyword matching (prioritizing longer matches or exact hits could be an improvement)
    const match = knowledgeBase.find(item =>
        item.keywords.some(keyword => lowerQuery.includes(keyword))
    );

    if (match) {
        return match.response;
    }

    // Fallback for related terms not explicitly in keywords
    if (lowerQuery.includes('resume') || lowerQuery.includes('cv')) {
        return "I don't have a direct file download here, but I can tell you about my experience at Bank of America, Deloitte, PwC, and my education at Duke Fuqua. What would you like to know?";
    }

    return "I'm not sure about that specific detail. As an AI assistant, my knowledge is based on Santanu's professional profile (Strategy, Risk Management, Automation). Feel free to ask about his experience at Bank of America, his MBA, or his contact info!";
}
