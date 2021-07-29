export const actions = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete',
    ALL: 'all'
}

export const resources = {
    CMS_OPERATOR: {
        name: 'cms-operator',
        path: {
            UPLOAD: 'upload',
            CLIENT: 'client',
            USER: 'user',
            CONTENT: 'content',
            COMPOSER: 'composer',
            ARTIST: 'artist',
            DISTRIBUTOR_CONTRACT: 'distributor-contract',
            AUTHOR_RIGHT: 'author-right',
            RECORDING_RIGHT: 'recording-right',
            INGEST_CONFIG: 'ingest-config',
            DISTRIBUTOR_ANALYTIC: 'distributor-analytic',
            PARTNER_ANALYTIC: 'partner-analytic',
        }
    },
    CMS_PARTNER: {
        name: 'cms-partner',
        path: {
            UPLOAD: 'upload',
            CONTENT: 'content',
            DISTRIBUTOR_ANALYTIC: 'distributor-analytic',
            PARTNER_ANALYTIC: 'partner-analytic',
        }
    },
    SDP: {
        name: 'sdp',
        path: {
            CONTENT: 'content',
            VERIFY_CONTENT: 'verify-content'
        }
    }
}