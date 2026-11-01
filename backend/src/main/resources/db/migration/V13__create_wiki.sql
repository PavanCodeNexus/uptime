-- V13: Wiki & Knowledge Module

CREATE TABLE wiki_articles (
  id                    BIGSERIAL PRIMARY KEY,
  title                 VARCHAR(300) NOT NULL,
  slug                  VARCHAR(300) UNIQUE NOT NULL,
  industry              VARCHAR(20) NOT NULL,
  device_brand          VARCHAR(100),
  device_model          VARCHAR(200),
  fault_category        VARCHAR(100) NOT NULL,
  fault_description     TEXT NOT NULL,
  root_cause            TEXT,
  fix_steps             JSONB NOT NULL,
  difficulty            VARCHAR(20) NOT NULL,   -- EASY/MEDIUM/HARD/PROFESSIONAL
  tools_required        JSONB DEFAULT '[]',
  parts_required        JSONB DEFAULT '[]',
  estimated_cost_min    DECIMAL(10,2),
  estimated_cost_max    DECIMAL(10,2),
  estimated_time_mins   INT,
  success_rate          DECIMAL(5,2) DEFAULT 0.00,
  total_attempts        INT DEFAULT 0,
  total_successes       INT DEFAULT 0,
  is_diy_safe           BOOLEAN DEFAULT FALSE,
  safety_warnings       JSONB DEFAULT '[]',
  india_specific        BOOLEAN DEFAULT FALSE,
  india_region          VARCHAR(50),
  climate_condition     VARCHAR(30),
  monsoon_specific      BOOLEAN DEFAULT FALSE,
  power_quality_note    TEXT,
  language              VARCHAR(10) DEFAULT 'en',
  is_auto_generated     BOOLEAN DEFAULT FALSE,
  is_verified           BOOLEAN DEFAULT FALSE,
  is_featured           BOOLEAN DEFAULT FALSE,
  views_count           INT DEFAULT 0,
  helpful_count         INT DEFAULT 0,
  not_helpful_count     INT DEFAULT 0,
  created_by            BIGINT,
  created_by_type       VARCHAR(20),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ,
  deleted_at            TIMESTAMPTZ);

CREATE UNIQUE INDEX uq_wiki_slug ON wiki_articles(slug);
CREATE INDEX idx_wiki_industry  ON wiki_articles(industry);
CREATE INDEX idx_wiki_fault     ON wiki_articles(fault_category);
CREATE INDEX idx_wiki_verified  ON wiki_articles(is_verified);
CREATE INDEX idx_wiki_fulltext  ON wiki_articles
  USING gin(to_tsvector('english', title || ' ' || fault_category || ' ' || fault_description));


CREATE TABLE wiki_versions (
  id                BIGSERIAL PRIMARY KEY,
  article_id        BIGINT NOT NULL REFERENCES wiki_articles(id),
  version_number    INT NOT NULL,
  content_snapshot  JSONB NOT NULL,
  change_summary    TEXT,
  changed_by        BIGINT NOT NULL,
  changed_by_type   VARCHAR(20) NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW());

CREATE INDEX idx_wiki_versions_article ON wiki_versions(article_id);


CREATE TABLE wiki_contributions (
  id                BIGSERIAL PRIMARY KEY,
  article_id        BIGINT NOT NULL REFERENCES wiki_articles(id),
  contributor_id    BIGINT NOT NULL,
  contributor_type  VARCHAR(20) NOT NULL,
  contribution_type VARCHAR(30) NOT NULL,  -- CREATED/EDITED/VERIFIED/FIX_ADDED
  points_earned     INT DEFAULT 0,
  job_reference_id  BIGINT REFERENCES jobs(id),
  created_at        TIMESTAMPTZ DEFAULT NOW());


CREATE TABLE wiki_votes (
  id            BIGSERIAL PRIMARY KEY,
  article_id    BIGINT NOT NULL REFERENCES wiki_articles(id),
  voter_id      BIGINT NOT NULL,
  voter_type    VARCHAR(20) NOT NULL,
  vote_type     VARCHAR(20) NOT NULL,  -- HELPFUL/NOT_HELPFUL
  created_at    TIMESTAMPTZ DEFAULT NOW());

CREATE UNIQUE INDEX uq_wiki_vote ON wiki_votes(article_id, voter_id);


CREATE TABLE wiki_comments (
  id              BIGSERIAL PRIMARY KEY,
  article_id      BIGINT NOT NULL REFERENCES wiki_articles(id),
  parent_id       BIGINT REFERENCES wiki_comments(id),
  commenter_id    BIGINT NOT NULL,
  commenter_type  VARCHAR(20) NOT NULL,
  comment_text    TEXT NOT NULL,
  language        VARCHAR(10) DEFAULT 'en',
  is_verified_fix BOOLEAN DEFAULT FALSE,
  helpful_votes   INT DEFAULT 0,
  is_reported     BOOLEAN DEFAULT FALSE,
  is_hidden       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ,
  deleted_at      TIMESTAMPTZ);

CREATE INDEX idx_wiki_comments_article ON wiki_comments(article_id);
CREATE INDEX idx_wiki_comments_parent  ON wiki_comments(parent_id);

