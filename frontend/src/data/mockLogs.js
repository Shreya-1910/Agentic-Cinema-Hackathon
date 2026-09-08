export const mockLogs = [
  {
    logName: "genai-agent-logs",
    textPayload: "Starting analysis for 'Untitled Sci-Fi Thriller'",
    timestamp: "2026-09-07T10:15:23.000Z",
    receiveTimestamp: "2026-09-07T10:15:23.450Z",
    severity: "INFO",
    insertId: "abc123-001",
    trace: "trace-xyz-001",
    spanId: "span-001",
    traceSampled: true,
    resource: {
      type: "genai_agent",
      labels: {
        project_id: "film-studio-ai",
        location: "us-central1"
      }
    },
    labels: {
      gen_ai_conversation_id: "conv-789xyz",
      gen_ai_agent_name: "GreenlightReport-v2",
      gen_ai_input_messages_ref: "ref-input-001",
      gen_ai_output_messages_ref: "ref-output-001",
      gen_ai_system_instructions_ref: "ref-system-001",
      gen_ai_usage_input_tokens: "245",
      gen_ai_usage_output_tokens: "1890",
      gen_ai_response_finish_reasons: "complete",
      gen_ai_tool_definitions: "search_films, analyze_box_office",
      gen_ai_tool_definitions_ref: "ref-tools-001",
      gcp_vertex_agent_invocation_id: "invoke-001",
      gcp_vertex_agent_event_id: "event-001",
      event_name: "start_analysis"
    }
  },
  {
    logName: "genai-agent-logs",
    textPayload: "Searching competing films... found 12 matches",
    timestamp: "2026-09-07T10:15:24.500Z",
    receiveTimestamp: "2026-09-07T10:15:24.920Z",
    severity: "INFO",
    insertId: "abc123-002",
    trace: "trace-xyz-001",
    spanId: "span-002",
    traceSampled: true,
    resource: {
      type: "genai_agent",
      labels: {
        project_id: "film-studio-ai",
        location: "us-central1"
      }
    },
    labels: {
      gen_ai_conversation_id: "conv-789xyz",
      gen_ai_agent_name: "GreenlightReport-v2",
      gen_ai_input_messages_ref: "ref-input-001",
      gen_ai_output_messages_ref: "ref-output-002",
      gen_ai_system_instructions_ref: "ref-system-001",
      gen_ai_usage_input_tokens: "180",
      gen_ai_usage_output_tokens: "2100",
      gen_ai_response_finish_reasons: "complete",
      gen_ai_tool_definitions: "search_films",
      gen_ai_tool_definitions_ref: "ref-tools-001",
      gcp_vertex_agent_invocation_id: "invoke-001",
      gcp_vertex_agent_event_id: "event-002",
      event_name: "search_competitors"
    }
  },
  {
    logName: "genai-agent-logs",
    textPayload: "ERROR: Box office API rate limit exceeded",
    timestamp: "2026-09-07T10:15:25.200Z",
    receiveTimestamp: "2026-09-07T10:15:25.680Z",
    severity: "ERROR",
    insertId: "abc123-003",
    trace: "trace-xyz-001",
    spanId: "span-003",
    traceSampled: true,
    resource: {
      type: "genai_agent",
      labels: {
        project_id: "film-studio-ai",
        location: "us-central1"
      }
    },
    labels: {
      gen_ai_conversation_id: "conv-789xyz",
      gen_ai_agent_name: "GreenlightReport-v2",
      gen_ai_input_messages_ref: "ref-input-001",
      gen_ai_output_messages_ref: "ref-output-003",
      gen_ai_system_instructions_ref: "ref-system-001",
      gen_ai_usage_input_tokens: "0",
      gen_ai_usage_output_tokens: "0",
      gen_ai_response_finish_reasons: "error",
      gen_ai_tool_definitions: "analyze_box_office",
      gen_ai_tool_definitions_ref: "ref-tools-001",
      gcp_vertex_agent_invocation_id: "invoke-001",
      gcp_vertex_agent_event_id: "event-003",
      event_name: "api_error"
    }
  },
  {
    logName: "genai-agent-logs",
    textPayload: "WARNING: Retrying box office analysis (attempt 2)",
    timestamp: "2026-09-07T10:15:26.800Z",
    receiveTimestamp: "2026-09-07T10:15:27.150Z",
    severity: "WARNING",
    insertId: "abc123-004",
    trace: "trace-xyz-001",
    spanId: "span-004",
    traceSampled: true,
    resource: {
      type: "genai_agent",
      labels: {
        project_id: "film-studio-ai",
        location: "us-central1"
      }
    },
    labels: {
      gen_ai_conversation_id: "conv-789xyz",
      gen_ai_agent_name: "GreenlightReport-v2",
      gen_ai_input_messages_ref: "ref-input-001",
      gen_ai_output_messages_ref: "ref-output-004",
      gen_ai_system_instructions_ref: "ref-system-001",
      gen_ai_usage_input_tokens: "0",
      gen_ai_usage_output_tokens: "0",
      gen_ai_response_finish_reasons: "retry",
      gen_ai_tool_definitions: "analyze_box_office",
      gen_ai_tool_definitions_ref: "ref-tools-001",
      gcp_vertex_agent_invocation_id: "invoke-001",
      gcp_vertex_agent_event_id: "event-004",
      event_name: "retry_attempt"
    }
  },
  {
    logName: "genai-agent-logs",
    textPayload: "Successfully generated Greenlight report: VERDICT: Greenlight, Score: 78/100",
    timestamp: "2026-09-07T10:15:28.100Z",
    receiveTimestamp: "2026-09-07T10:15:28.550Z",
    severity: "INFO",
    insertId: "abc123-005",
    trace: "trace-xyz-001",
    spanId: "span-005",
    traceSampled: true,
    resource: {
      type: "genai_agent",
      labels: {
        project_id: "film-studio-ai",
        location: "us-central1"
      }
    },
    labels: {
      gen_ai_conversation_id: "conv-789xyz",
      gen_ai_agent_name: "GreenlightReport-v2",
      gen_ai_input_messages_ref: "ref-input-001",
      gen_ai_output_messages_ref: "ref-output-005",
      gen_ai_system_instructions_ref: "ref-system-001",
      gen_ai_usage_input_tokens: "320",
      gen_ai_usage_output_tokens: "2450",
      gen_ai_response_finish_reasons: "complete",
      gen_ai_tool_definitions: "generate_report",
      gen_ai_tool_definitions_ref: "ref-tools-001",
      gcp_vertex_agent_invocation_id: "invoke-001",
      gcp_vertex_agent_event_id: "event-005",
      event_name: "report_generated"
    }
  },
  {
    logName: "genai-agent-logs",
    textPayload: "Starting analysis for 'The Last Frontier' - Western/Drama",
    timestamp: "2026-09-07T09:45:10.000Z",
    receiveTimestamp: "2026-09-07T09:45:10.450Z",
    severity: "INFO",
    insertId: "abc123-006",
    trace: "trace-xyz-002",
    spanId: "span-001",
    traceSampled: true,
    resource: {
      type: "genai_agent",
      labels: {
        project_id: "film-studio-ai",
        location: "eu-west1"
      }
    },
    labels: {
      gen_ai_conversation_id: "conv-456abc",
      gen_ai_agent_name: "GreenlightReport-v2",
      gen_ai_input_messages_ref: "ref-input-002",
      gen_ai_output_messages_ref: "ref-output-006",
      gen_ai_system_instructions_ref: "ref-system-001",
      gen_ai_usage_input_tokens: "190",
      gen_ai_usage_output_tokens: "0",
      gen_ai_response_finish_reasons: "in_progress",
      gen_ai_tool_definitions: "search_films",
      gen_ai_tool_definitions_ref: "ref-tools-001",
      gcp_vertex_agent_invocation_id: "invoke-002",
      gcp_vertex_agent_event_id: "event-006",
      event_name: "start_analysis"
    }
  },
  {
    logName: "genai-agent-logs",
    textPayload: "Found 12 competing films, narrowing to top 5 comps",
    timestamp: "2026-09-07T09:45:11.500Z",
    receiveTimestamp: "2026-09-07T09:45:11.930Z",
    severity: "INFO",
    insertId: "abc123-007",
    trace: "trace-xyz-002",
    spanId: "span-002",
    traceSampled: true,
    resource: {
      type: "genai_agent",
      labels: {
        project_id: "film-studio-ai",
        location: "eu-west1"
      }
    },
    labels: {
      gen_ai_conversation_id: "conv-456abc",
      gen_ai_agent_name: "GreenlightReport-v2",
      gen_ai_input_messages_ref: "ref-input-002",
      gen_ai_output_messages_ref: "ref-output-007",
      gen_ai_system_instructions_ref: "ref-system-001",
      gen_ai_usage_input_tokens: "150",
      gen_ai_usage_output_tokens: "200",
      gen_ai_response_finish_reasons: "complete",
      gen_ai_tool_definitions: "search_films, filter_competitors",
      gen_ai_tool_definitions_ref: "ref-tools-001",
      gcp_vertex_agent_invocation_id: "invoke-002",
      gcp_vertex_agent_event_id: "event-007",
      event_name: "filter_competitors"
    }
  },
  {
    logName: "genai-agent-logs",
    textPayload: "WARNING: Low confidence in audience trend data for western genre",
    timestamp: "2026-09-07T09:45:13.200Z",
    receiveTimestamp: "2026-09-07T09:45:13.680Z",
    severity: "WARNING",
    insertId: "abc123-008",
    trace: "trace-xyz-002",
    spanId: "span-003",
    traceSampled: true,
    resource: {
      type: "genai_agent",
      labels: {
        project_id: "film-studio-ai",
        location: "eu-west1"
      }
    },
    labels: {
      gen_ai_conversation_id: "conv-456abc",
      gen_ai_agent_name: "GreenlightReport-v2",
      gen_ai_input_messages_ref: "ref-input-002",
      gen_ai_output_messages_ref: "ref-output-008",
      gen_ai_system_instructions_ref: "ref-system-001",
      gen_ai_usage_input_tokens: "0",
      gen_ai_usage_output_tokens: "0",
      gen_ai_response_finish_reasons: "warning",
      gen_ai_tool_definitions: "analyze_trends",
      gen_ai_tool_definitions_ref: "ref-tools-001",
      gcp_vertex_agent_invocation_id: "invoke-002",
      gcp_vertex_agent_event_id: "event-008",
      event_name: "low_confidence"
    }
  },
  {
    logName: "genai-agent-logs",
    textPayload: "ERROR: Timeout while analyzing box office data",
    timestamp: "2026-09-07T09:45:15.000Z",
    receiveTimestamp: "2026-09-07T09:45:15.500Z",
    severity: "ERROR",
    insertId: "abc123-009",
    trace: "trace-xyz-002",
    spanId: "span-004",
    traceSampled: true,
    resource: {
      type: "genai_agent",
      labels: {
        project_id: "film-studio-ai",
        location: "eu-west1"
      }
    },
    labels: {
      gen_ai_conversation_id: "conv-456abc",
      gen_ai_agent_name: "GreenlightReport-v2",
      gen_ai_input_messages_ref: "ref-input-002",
      gen_ai_output_messages_ref: "ref-output-009",
      gen_ai_system_instructions_ref: "ref-system-001",
      gen_ai_usage_input_tokens: "0",
      gen_ai_usage_output_tokens: "0",
      gen_ai_response_finish_reasons: "timeout",
      gen_ai_tool_definitions: "analyze_box_office",
      gen_ai_tool_definitions_ref: "ref-tools-001",
      gcp_vertex_agent_invocation_id: "invoke-002",
      gcp_vertex_agent_event_id: "event-009",
      event_name: "timeout"
    }
  }
];

// Helper function to calculate stats from logs
export const getLogStats = (logs) => {
  const totalLogs = logs.length;
  const errors = logs.filter(l => l.severity === 'ERROR').length;
  const warnings = logs.filter(l => l.severity === 'WARNING').length;
  
  const totalInputTokens = logs.reduce((sum, log) => {
    return sum + parseInt(log.labels?.gen_ai_usage_input_tokens || '0', 10);
  }, 0);
  
  const totalOutputTokens = logs.reduce((sum, log) => {
    return sum + parseInt(log.labels?.gen_ai_usage_output_tokens || '0', 10);
  }, 0);
  
  const uniqueConversations = new Set(
    logs.map(l => l.labels?.gen_ai_conversation_id)
  ).size;
  
  const finishReasons = {};
  logs.forEach(log => {
    const reason = log.labels?.gen_ai_response_finish_reasons || 'unknown';
    finishReasons[reason] = (finishReasons[reason] || 0) + 1;
  });
  
  const eventNames = {};
  logs.forEach(log => {
    const event = log.labels?.event_name || 'unknown';
    eventNames[event] = (eventNames[event] || 0) + 1;
  });
  
  return {
    totalLogs,
    errors,
    warnings,
    totalInputTokens,
    totalOutputTokens,
    uniqueConversations,
    finishReasons,
    eventNames
  };
};