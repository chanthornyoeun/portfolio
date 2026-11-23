-- Proposed public capability tags (tech_visibility stays 'general').
-- These are presentation labels, not proof of client approval: review confidentiality obligations first.
-- Run in the SQL Editor after the tech_visibility migration, then re-run the deploy workflow. Safe to re-run.
update public.projects set capability_tags = array['Frontend Engineering', 'UI/UX Prototyping', 'API Integration', 'Business Analysis', 'Client Collaboration']
where slug = 'petroleum-distribution';

update public.projects set capability_tags = array['Frontend Engineering', 'Enterprise Applications', 'API Integration', 'Technical Leadership', 'Business Workflows']
where slug = 'general-core-insurance';

update public.projects set capability_tags = array['Full-Stack Engineering', 'Real-Time Systems', 'Concurrency Control', 'Transaction Processing', 'Performance Optimization']
where slug = 'real-time-auction';

-- Review note: the role covered backend AND Vue.js frontend work, and the verified export work is
-- "large-volume data exports". Consider 'Full-Stack Engineering' and 'Large-Volume Data Export' instead of
-- 'Backend Engineering' and 'Data Processing'.
update public.projects set capability_tags = array['Backend Engineering', 'Database Optimization', 'Enterprise CRM', 'Data Processing', 'Performance Troubleshooting']
where slug = 'enterprise-crm';
