// Rules Loader for Fam Unity - GitHub Pages Static Version
class RulesLoader {
    constructor() {
        this.configData = null;
        this.rulesData = {};
        this.baseUrl = 'https://trpxx.github.io/FamUnity-Rules/';
        this.init();
    }

    async init() {
        console.log('RulesLoader: Initializing...');
        
        // Show loading state
        this.showLoadingState();
        
        try {
            // Load configuration
            await this.loadConfigData();
            
            // Load all rules data
            await this.loadAllRulesData();
            
            console.log('RulesLoader: All files loaded successfully');
            this.renderRules();
        } catch (error) {
            console.error('RulesLoader: Failed to load rules data:', error);
            this.loadFallbackData();
            this.renderRules();
        }
    }

    loadFallbackData() {
        console.log('Loading fallback data...');
        
        // Fallback configuration
        this.configData = {
            pageInfo: {
                title: "กฎ",
                pageTitle: "กฎ | Fam Unity",
                heroTitle: "กฎ",
                heroSubtitle: "Rules - Fam Unity",
                heroDescription: "กฎและข้อกำหนดของ Fam Unity เพื่อประสบการณ์เล่นเกมที่ดี"
            },
            ruleFiles: [
                "new-player-rules.json",
                "roleplay-rules.json",
                "stream-snipe-rules.json",
                "server-country-rules.json"
            ]
        };        // Fallback rules data
        this.rulesData = {
            'new-player-rules': {
                title: 'กฎสำหรับผู้เล่นใหม่',
                description: 'กฎพื้นฐานสำหรับผู้เข้าใหม่ในเซิร์ฟเวอร์',
                rules: [
                    {
                        text: 'การสมัครสมาชิก',
                        description: 'ผู้เล่นใหม่ต้องอ่านกฎทั้งหมดก่อนเริ่มเล่น',
                        examples: ['อ่านกฎในเว็บไซต์', 'ยืนยันการอ่านกฎ'],
                        penalty: 'เตือน'
                    },
                    {
                        text: 'การเล่นครั้งแรก',
                        description: 'ให้ติดต่อแอดมินเพื่อรับคำแนะนำการเล่น',
                        penalty: 'ไม่มี'
                    }
                ]
            },
            'roleplay-rules': {
                title: 'กฎ Roleplay',
                description: 'กฎการเล่นบทบาทในเกม',
                rules: [
                    {
                        text: 'การแสดงบทบาท',
                        description: 'ต้องเล่นตามบทบาทอย่างสมจริง',
                        penalty: 'เตือน - แบน'
                    },
                    {
                        text: 'การพูดคุยในตัวละคร (IC)',
                        description: 'ต้องพูดในลักษณะตัวละครเท่านั้น',
                        penalty: 'เตือน'
                    }
                ]
            },
            'stream-snipe-rules': {
                title: 'กฎ Stream Snipe',
                description: 'กฎเกี่ยวกับการไล่ล่าผู้ที่กำลังสตรีม',
                rules: [
                    {
                        text: 'ห้าม Stream Snipe',
                        description: 'ห้ามใช้ข้อมูลจากการสตรีมมาใช้ในเกม',
                        penalty: 'แบนถาวร'
                    }
                ]
            },
            'server-country-rules': {
                title: 'ข้อบังคับประจำเซิร์ฟเวอร์',
                description: 'กฎข้อบังคับทั่วไปของเซิร์ฟเวอร์',
                rules: [
                    {
                        text: 'ความเคารพ',
                        description: 'เคารพผู้เล่นคนอื่นและเจ้าหน้าที่',
                        penalty: 'เตือน - แบน'
                    },
                    {
                        text: 'การใช้ภาษา',
                        description: 'ใช้ภาษาที่สุภาพ ไม่ด่าทอ',
                        penalty: 'เตือน'
                    }
                ]
            }
        };
    }    async loadConfigData() {
        try {
            const response = await fetch(this.baseUrl + 'data/rules-config.json');
            if (!response.ok) {
                throw new Error(`Failed to load config: ${response.status}`);
            }
            this.configData = await response.json();
            console.log('Config loaded:', this.configData);
        } catch (error) {
            console.warn('Failed to load config, using fallback');
            // Fallback config
            this.configData = {
                pageInfo: {
                    title: "กฎ",
                    pageTitle: "กฎ | Fam Unity",
                    heroTitle: "กฎ",
                    heroSubtitle: "Rules - Fam Unity",
                    heroDescription: "กฎและข้อกำหนดของ Fam Unity เพื่อประสบการณ์เล่นเกมที่ดี"
                },
                ruleFiles: [
                    "new-player-rules.json",
                    "roleplay-rules.json",
                    "stream-snipe-rules.json",
                    "server-country-rules.json"
                ]
            };
        }
    }    async loadVisibilityConfig() {
        try {
            console.log('Loading visibility configuration...');
            const response = await fetch(this.baseUrl + 'data/rules-visibility-config.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            this.visibilityConfig = await response.json();
            console.log('✅ Visibility configuration loaded successfully');
        } catch (error) {
            console.warn('⚠️ Could not load visibility config:', error);
            this.visibilityConfig = null;
        }
    }

    async loadAllRulesData() {
        console.log('Loading all rules data...');
        const promises = [];
        
        if (this.configData && this.configData.rules) {
            for (const ruleConfig of this.configData.rules) {
                if (ruleConfig.enabled && ruleConfig.file) {
                    promises.push(this.loadRuleFile(ruleConfig.id, ruleConfig.file));
                }
            }
        }
        
        await Promise.allSettled(promises);
        console.log('✅ All rules data loading completed');
    }

    async loadRuleFile(id, filePath) {
        try {
            console.log(`Loading ${id} from ${filePath}...`);
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            this.rulesData[id] = data;
            console.log(`✅ ${id} loaded successfully`);
        } catch (error) {
            console.error(`❌ Failed to load ${id}:`, error);
            // Set empty data to prevent crashes
            this.rulesData[id] = {
                title: `ไม่สามารถโหลด ${id}`,
                description: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
                rules: []
            };
        }
    }showLoadingState() {
        const newPlayerContainer = document.getElementById('new-player-rules-container');
        const roleplayContainer = document.getElementById('roleplay-rules-container');
        const streamSnipeContainer = document.getElementById('stream-snipe-rules-container');
        const serverCountryContainer = document.getElementById('server-country-rules-container');
        const twitterContainer = document.getElementById('twitter-rules-container');
        const robberyContainer = document.getElementById('robbery-rules-container');        const summonEvidenceContainer = document.getElementById('summon-evidence-rules-container');
        const evidenceSubmissionContainer = document.getElementById('evidence-submission-rules-container');        const kidnappingContainer = document.getElementById('kidnapping-rules-container');        const generalShopRobberyContainer = document.getElementById('airdrop-rules-container');
        const shopRobberyActivityContainer = document.getElementById('shop-robbery-activity-rules-container');        const familyGangShopRobberyContainer = document.getElementById('family-gang-shop-robbery-rules-container');        const gangAuctionCarContainer = document.getElementById('gang-auction-car-rules-container');
        const familyAuctionCarContainer = document.getElementById('family-auction-car-rules-container');
        const licenseRevocationContainer = document.getElementById('license-revocation-rules-container');
          
        if (newPlayerContainer) {
            newPlayerContainer.innerHTML = `
                <div class="rules-loading-v2">
                    <div class="loading-spinner-v2"></div>
                    <p class="loading-text-v2">กำลังโหลดกฎผู้เล่นใหม่...</p>
                </div>
            `;
        }
        
        if (roleplayContainer) {
            roleplayContainer.innerHTML = `
                <div class="rules-loading-v2">
                    <div class="loading-spinner-v2"></div>
                    <p class="loading-text-v2">กำลังโหลดกฎ Roleplay...</p>
                </div>
            `;
        }
        
        if (streamSnipeContainer) {
            streamSnipeContainer.innerHTML = `
                <div class="rules-loading-v2">
                    <div class="loading-spinner-v2"></div>
                    <p class="loading-text-v2">กำลังโหลดกฎ Stream Snipe...</p>
                </div>
            `;
        }

        if (serverCountryContainer) {
            serverCountryContainer.innerHTML = `
                <div class="rules-loading-v2">
                    <div class="loading-spinner-v2"></div>
                    <p class="loading-text-v2">กำลังโหลดกฏ ข้อบังคับประจำเชิร์ฟเวอร์...</p>
                </div>
            `;
        }
        
        if (twitterContainer) {
            twitterContainer.innerHTML = `
                <div class="rules-loading-v2">
                    <div class="loading-spinner-v2"></div>
                    <p class="loading-text-v2">กำลังโหลดกฎการใช้งาน Twitter...</p>
                </div>
            `;
        }

        if (robberyContainer) {
            robberyContainer.innerHTML = `
                <div class="rules-loading-v2">
                    <div class="loading-spinner-v2"></div>
                    <p class="loading-text-v2">กำลังโหลดกฎการปล้น...</p>
                </div>
            `;
        }

        if (summonEvidenceContainer) {
            summonEvidenceContainer.innerHTML = `
                <div class="rules-loading-v2">
                    <div class="loading-spinner-v2"></div>
                    <p class="loading-text-v2">กำลังโหลดกฎหมายเรียก และการแจ้งหลักฐาน...</p>
                </div>
            `;
        }        if (evidenceSubmissionContainer) {
            evidenceSubmissionContainer.innerHTML = `
                <div class="rules-loading-v2">
                    <div class="loading-spinner-v2"></div>
                    <p class="loading-text-v2">กำลังโหลดการส่งหลักฐาน...</p>
                </div>
            `;
        }        if (kidnappingContainer) {
            kidnappingContainer.innerHTML = `
                <div class="rules-loading-v2">
                    <div class="loading-spinner-v2"></div>
                    <p class="loading-text-v2">กำลังโหลดกฎการอุ้ม...</p>
                </div>
            `;
        }

        if (generalShopRobberyContainer) {
            generalShopRobberyContainer.innerHTML = `
                <div class="rules-loading-v2">
                    <div class="loading-spinner-v2"></div>
                    <p class="loading-text-v2">กำลังโหลดกฎกิจกรรมงัดร้าน (กฎกลาง)...</p>
                </div>
            `;
        }if (shopRobberyActivityContainer) {
            shopRobberyActivityContainer.innerHTML = `
                <div class="rules-loading-v2">
                    <div class="loading-spinner-v2"></div>
                    <p class="loading-text-v2">กำลังโหลดกฎกิจกรรมงัดร้าน (ประชาชน)...</p>
                </div>
            `;
        }        if (familyGangShopRobberyContainer) {
            familyGangShopRobberyContainer.innerHTML = `
                <div class="rules-loading-v2">
                    <div class="loading-spinner-v2"></div>
                    <p class="loading-text-v2">กำลังโหลดกฎกิจกรรมงัดร้าน (ครอบครัวและแก๊ง)...</p>
                </div>
            `;
        }        if (gangAuctionCarContainer) {
            gangAuctionCarContainer.innerHTML = `
                <div class="rules-loading-v2">
                    <div class="loading-spinner-v2"></div>
                    <p class="loading-text-v2">กำลังโหลดกฎการถือรถประมูลสำหรับแก๊ง...</p>
                </div>
            `;
        }        if (familyAuctionCarContainer) {
            familyAuctionCarContainer.innerHTML = `
                <div class="rules-loading-v2">
                    <div class="loading-spinner-v2"></div>
                    <p class="loading-text-v2">กำลังโหลดกฎการถือรถประมูลสำหรับครอบครัว...</p>
                </div>
            `;
        }

        if (licenseRevocationContainer) {
            licenseRevocationContainer.innerHTML = `
                <div class="rules-loading-v2">
                    <div class="loading-spinner-v2"></div>
                    <p class="loading-text-v2">กำลังโหลดกำหนดโทษปลดใบ...</p>
                </div>
            `;
        }
    }async loadConfigData() {
        const possiblePaths = [
            './data/rules-config.json',
            'data/rules-config.json',
            '../data/rules-config.json',
            './src/data/rules-config.json',
            'src/data/rules-config.json'
        ];
        
        let response;
        let lastError;
        
        for (const path of possiblePaths) {
            try {
                console.log(`Trying to load config from: ${path}`);
                response = await fetch(path);
                if (response.ok) {
                    this.configData = await response.json();
                    console.log('Successfully loaded config from:', path);
                    console.log('Config data:', this.configData);
                    return;
                }
                console.warn(`Config request failed with status ${response.status} for path: ${path}`);
            } catch (error) {
                lastError = error;
                console.warn(`Failed to load config from ${path}:`, error);
            }
        }
        
        throw new Error(`Failed to load config from any path. Last error: ${lastError?.message}`);
    }

    async loadVisibilityConfig() {
        const visibilityFile = this.configData.visibilityConfigFile || 'rules-visibility-config.json';
        const possiblePaths = [
            `./data/${visibilityFile}`,
            `data/${visibilityFile}`,
            `../data/${visibilityFile}`,
            `./src/data/${visibilityFile}`,
            `src/data/${visibilityFile}`
        ];
        
        for (const path of possiblePaths) {
            try {
                console.log(`Trying to load visibility config from: ${path}`);
                const response = await fetch(path);
                if (response.ok) {
                    this.visibilityConfig = await response.json();
                    console.log('Successfully loaded visibility config from:', path);
                    console.log('Visibility config:', this.visibilityConfig);
                    return;
                }
            } catch (error) {
                console.warn(`Failed to load visibility config from ${path}:`, error);
            }
        }
        
        console.warn('Failed to load visibility config, using default settings');
        this.visibilityConfig = null;
    }

    getVisibleRules() {
        if (!this.visibilityConfig || !this.visibilityConfig.settings.enableVisibilityControl) {
            return this.configData.ruleFiles;
        }

        const visibleRules = [];
        const rulesVisibility = this.visibilityConfig.rulesVisibility;

        // Sort rules by order and filter enabled ones
        Object.keys(rulesVisibility)
            .filter(ruleKey => rulesVisibility[ruleKey].enabled)
            .sort((a, b) => rulesVisibility[a].order - rulesVisibility[b].order)
            .forEach(ruleKey => {
                const filename = `${ruleKey}.json`;
                if (this.configData.ruleFiles.includes(filename)) {
                    visibleRules.push(filename);
                }
            });

        console.log('Visible rules:', visibleRules);
        return visibleRules;
    }

    getVisibleCategories() {
        if (!this.visibilityConfig || !this.visibilityConfig.settings.enableVisibilityControl) {
            // Return default categories if no config
            return {
                'basic': { name: 'กฎพื้นฐาน', icon: 'fas fa-book', color: 'blue', enabled: true, order: 1 },
                'safety': { name: 'กฎความปลอดภัย', icon: 'fas fa-shield-alt', color: 'red', enabled: true, order: 2 },
                'action': { name: 'กฎการกระทำ', icon: 'fas fa-fist-raised', color: 'orange', enabled: true, order: 3 },
                'activity': { name: 'กฎกิจกรรม', icon: 'fas fa-calendar-alt', color: 'green', enabled: true, order: 4 },
                'property': { name: 'กฎทรัพย์สิน', icon: 'fas fa-car', color: 'purple', enabled: true, order: 5 },
                'penalty': { name: 'กฎโทษ', icon: 'fas fa-balance-scale', color: 'red-600', enabled: true, order: 6 }
            };
        }        const categories = {};
        const visibleRules = this.getVisibleRules();
        
        // Get categories that have visible rules
        Object.keys(this.visibilityConfig.categories)
            .filter(catKey => this.visibilityConfig.categories[catKey].enabled)
            .forEach(catKey => {
                const hasRules = Object.keys(this.visibilityConfig.rulesVisibility)
                    .some(ruleKey => 
                        this.visibilityConfig.rulesVisibility[ruleKey].category === catKey &&
                        this.visibilityConfig.rulesVisibility[ruleKey].enabled &&
                        visibleRules.includes(`${ruleKey}.json`)
                    );
                
                if (hasRules || !this.visibilityConfig.settings.hideEmptyCategories) {
                    categories[catKey] = this.visibilityConfig.categories[catKey];
                }
            });

        return categories;
    }async loadAllRulesData() {
        if (!this.configData || !this.configData.ruleFiles) {
            throw new Error('Config data not loaded or missing ruleFiles');
        }

        const visibleRules = this.getVisibleRules();
        console.log('Loading visible rules:', visibleRules);        const loadPromises = visibleRules.map(async (filename) => {
            const possiblePaths = [
                `${this.baseUrl}data/${filename}`,
                `https://trpxx.github.io/FamUnity-Rules/data/${filename}`,
                `/FamUnity-Rules/data/${filename}`,
                `./data/${filename}`,
                `data/${filename}`,
                `../data/${filename}`,
                `./src/data/${filename}`,
                `src/data/${filename}`
            ];
            
            for (const path of possiblePaths) {
                try {
                    console.log(`Trying to load ${filename} from: ${path}`);
                    const response = await fetch(path);
                    if (response.ok) {
                        const data = await response.json();
                        // Use filename without extension as key, preserve case and hyphens
                        const key = filename.replace('.json', '');
                        this.rulesData[key] = data;
                        console.log(`Successfully loaded ${filename} as key '${key}' from:`, path);
                        return;
                    }
                    console.warn(`Rules request failed with status ${response.status} for ${filename} at path: ${path}`);
                } catch (error) {
                    console.warn(`Failed to load ${filename} from ${path}:`, error);
                }
            }
            
            throw new Error(`Failed to load ${filename} from any path`);
        });

        await Promise.all(loadPromises);
        console.log('All visible rules data loaded:', Object.keys(this.rulesData));
        console.log('Rules data:', this.rulesData);
    }    renderRules() {
        console.log('renderRules called');
        console.log('configData:', this.configData);
        console.log('rulesData:', this.rulesData);
        
        if (!this.configData || !this.rulesData) {
            console.log('Missing data - configData:', !!this.configData, 'rulesData:', !!this.rulesData);
            return;
        }

        // Update page title
        document.title = this.configData.pageInfo.pageTitle;
        
        // Update hero section
        this.updateHeroSection();
        
        // Update navigation
        this.updateNavigation();
        
        // Render rules content
        this.renderRulesContent();
        
        // Update contact section
        this.updateContactSection();

        // Hide disabled sections
        this.hideDisabledSections();
        
        // Hide disabled navigation links
        this.hideDisabledNavigationLinks();
    }

    updateHeroSection() {
        const heroTitle = document.querySelector('h1');
        const heroSubtitle = document.querySelector('h2');
        const heroDescription = document.querySelector('.text-lg.text-gray-600');

        if (heroTitle) {
            heroTitle.textContent = this.configData.pageInfo.heroTitle;
        }
        if (heroSubtitle) {
            heroSubtitle.textContent = this.configData.pageInfo.heroSubtitle;
        }
        if (heroDescription) {
            heroDescription.textContent = this.configData.pageInfo.heroDescription;
        }
    }    updateNavigation() {
        // Navigation updates handled by sidebar only - Quick Navigation removed
    }renderRulesContent() {
        console.log('renderRulesContent called');
        console.log('Available rules data keys:', Object.keys(this.rulesData));
        
        // Render New Player Rules
        if (this.rulesData['new-player-rules']) {
            console.log('Rendering new-player-rules...');
            const newPlayerContainer = document.getElementById('new-player-rules-container');
            const newPlayerCount = document.getElementById('new-player-count');
            console.log('New player container found:', !!newPlayerContainer);
            if (newPlayerContainer) {
                const rulesHtml = this.generateRulesHTML(this.rulesData['new-player-rules'], 'new-player');
                console.log('Generated HTML length:', rulesHtml.length);
                newPlayerContainer.innerHTML = rulesHtml;
            }
            if (newPlayerCount) {
                newPlayerCount.textContent = `${this.rulesData['new-player-rules'].rules.length} กฎ`;
            }
            // Update subtitle with description
            this.updateRulesSubtitle('new-player-rules', this.rulesData['new-player-rules'].description);
        }
        
        // Render Roleplay Rules
        if (this.rulesData['roleplay-rules']) {
            const roleplayContainer = document.getElementById('roleplay-rules-container');
            const roleplayCount = document.getElementById('roleplay-count');
            if (roleplayContainer) {
                const rulesHtml = this.generateRulesHTML(this.rulesData['roleplay-rules'], 'roleplay');
                roleplayContainer.innerHTML = rulesHtml;
            }
            if (roleplayCount) {
                roleplayCount.textContent = `${this.rulesData['roleplay-rules'].rules.length} กฎ`;
            }
            // Update subtitle with description
            this.updateRulesSubtitle('roleplay-rules', this.rulesData['roleplay-rules'].description);
        }
          // Render Stream Snipe Rules
        if (this.rulesData['stream-snipe-rules']) {
            const streamSnipeContainer = document.getElementById('stream-snipe-rules-container');
            const streamSnipeCount = document.getElementById('stream-snipe-count');
            if (streamSnipeContainer) {
                const rulesHtml = this.generateRulesHTML(this.rulesData['stream-snipe-rules'], 'stream-snipe');
                streamSnipeContainer.innerHTML = rulesHtml;
            }
            if (streamSnipeCount) {
                streamSnipeCount.textContent = `${this.rulesData['stream-snipe-rules'].rules.length} กฎ`;
            }
            // Update subtitle with description
            this.updateRulesSubtitle('stream-snipe-rules', this.rulesData['stream-snipe-rules'].description);
        }
          // Render Server Country Rules
        if (this.rulesData['server-country-rules']) {
            const serverCountryContainer = document.getElementById('server-country-rules-container');
            const serverCountryCount = document.getElementById('server-country-count');
            if (serverCountryContainer) {
                const rulesHtml = this.generateRulesHTML(this.rulesData['server-country-rules'], 'server-country');
                serverCountryContainer.innerHTML = rulesHtml;
            }
            if (serverCountryCount) {
                serverCountryCount.textContent = `${this.rulesData['server-country-rules'].rules.length} กฎ`;
            }            // Update subtitle with description
            this.updateRulesSubtitle('server-country-rules', this.rulesData['server-country-rules'].description);
        }
          // Render Twitter Rules
        if (this.rulesData['twitter-rules']) {
            const twitterContainer = document.getElementById('twitter-rules-container');
            const twitterCount = document.getElementById('twitter-count');
            if (twitterContainer) {
                const rulesHtml = this.generateRulesHTML(this.rulesData['twitter-rules'], 'twitter');
                twitterContainer.innerHTML = rulesHtml;
            }
            if (twitterCount) {
                twitterCount.textContent = `${this.rulesData['twitter-rules'].rules.length} กฎ`;
            }
            // Update subtitle with description
            this.updateRulesSubtitle('twitter-rules', this.rulesData['twitter-rules'].description);
        }
          // Render Robbery Rules
        if (this.rulesData['robbery-rules']) {
            const robberyContainer = document.getElementById('robbery-rules-container');
            const robberyCount = document.getElementById('robbery-count');
            if (robberyContainer) {
                const rulesHtml = this.generateRulesHTML(this.rulesData['robbery-rules'], 'robbery');
                robberyContainer.innerHTML = rulesHtml;
            }
            if (robberyCount) {
                robberyCount.textContent = `${this.rulesData['robbery-rules'].rules.length} กฎ`;
            }
            // Update subtitle with description
            this.updateRulesSubtitle('robbery-rules', this.rulesData['robbery-rules'].description);
        }
          // Render Summon Evidence Rules
        if (this.rulesData['summon-evidence-rules']) {
            const summonEvidenceContainer = document.getElementById('summon-evidence-rules-container');
            const summonEvidenceCount = document.getElementById('summon-evidence-count');
            if (summonEvidenceContainer) {
                const rulesHtml = this.generateRulesHTML(this.rulesData['summon-evidence-rules'], 'summon-evidence');
                summonEvidenceContainer.innerHTML = rulesHtml;
            }
            if (summonEvidenceCount) {
                summonEvidenceCount.textContent = `${this.rulesData['summon-evidence-rules'].rules.length} กฎ`;
            }
            // Update subtitle with description
            this.updateRulesSubtitle('summon-evidence-rules', this.rulesData['summon-evidence-rules'].description);
        }        // Render Evidence Submission Rules
        if (this.rulesData['evidence-submission-rules']) {
            const evidenceSubmissionContainer = document.getElementById('evidence-submission-rules-container');
            const evidenceSubmissionCount = document.getElementById('evidence-submission-count');
            if (evidenceSubmissionContainer) {
                const rulesHtml = this.generateRulesHTML(this.rulesData['evidence-submission-rules'], 'evidence-submission');
                evidenceSubmissionContainer.innerHTML = rulesHtml;
            }
            if (evidenceSubmissionCount) {
                evidenceSubmissionCount.textContent = `${this.rulesData['evidence-submission-rules'].rules.length} กฎ`;
            }
            // Update subtitle with description
            this.updateRulesSubtitle('evidence-submission-rules', this.rulesData['evidence-submission-rules'].description);
        }        // Render Kidnapping Rules
        if (this.rulesData['kidnapping-rules']) {
            const kidnappingContainer = document.getElementById('kidnapping-rules-container');
            const kidnappingCount = document.getElementById('kidnapping-count');
            if (kidnappingContainer) {
                const rulesHtml = this.generateRulesHTML(this.rulesData['kidnapping-rules'], 'kidnapping');
                kidnappingContainer.innerHTML = rulesHtml;
            }
            if (kidnappingCount) {
                kidnappingCount.textContent = `${this.rulesData['kidnapping-rules'].rules.length} กฎ`;
            }
            // Update subtitle with description
            this.updateRulesSubtitle('kidnapping-rules', this.rulesData['kidnapping-rules'].description);        }        // Render Airdrop Rules
        if (this.rulesData['airdrop-rules']) {
            const generalShopRobberyContainer = document.getElementById('airdrop-rules-container');
            const generalShopRobberyCount = document.getElementById('airdrop-count');
            if (generalShopRobberyContainer) {
                const rulesHtml = this.generateRulesHTML(this.rulesData['airdrop-rules'], 'airdrop');
                generalShopRobberyContainer.innerHTML = rulesHtml;
            }
            if (generalShopRobberyCount) {
                generalShopRobberyCount.textContent = `${this.rulesData['airdrop-rules'].rules.length} กฎ`;
            }
            // Update subtitle with description
            this.updateRulesSubtitle('airdrop-rules', this.rulesData['airdrop-rules'].description);
        }

        // Render Shop Robbery Activity Rules
        if (this.rulesData['shop-robbery-activity-rules']) {
            const shopRobberyActivityContainer = document.getElementById('shop-robbery-activity-rules-container');
            const shopRobberyActivityCount = document.getElementById('shop-robbery-activity-count');
            if (shopRobberyActivityContainer) {
                const rulesHtml = this.generateRulesHTML(this.rulesData['shop-robbery-activity-rules'], 'shop-robbery-activity');
                shopRobberyActivityContainer.innerHTML = rulesHtml;
            }
            if (shopRobberyActivityCount) {
                shopRobberyActivityCount.textContent = `${this.rulesData['shop-robbery-activity-rules'].rules.length} กฎ`;
            }
            // Update subtitle with description
            this.updateRulesSubtitle('shop-robbery-activity-rules', this.rulesData['shop-robbery-activity-rules'].description);
        }

        // Render Family & Gang Shop Robbery Rules
        if (this.rulesData['family-gang-shop-robbery-rules']) {
            const familyGangShopRobberyContainer = document.getElementById('family-gang-shop-robbery-rules-container');
            const familyGangShopRobberyCount = document.getElementById('family-gang-shop-robbery-count');
            if (familyGangShopRobberyContainer) {
                const rulesHtml = this.generateRulesHTML(this.rulesData['family-gang-shop-robbery-rules'], 'family-gang-shop-robbery');
                familyGangShopRobberyContainer.innerHTML = rulesHtml;
            }
            if (familyGangShopRobberyCount) {
                familyGangShopRobberyCount.textContent = `${this.rulesData['family-gang-shop-robbery-rules'].rules.length} กฎ`;
            }            // Update subtitle with description
            this.updateRulesSubtitle('family-gang-shop-robbery-rules', this.rulesData['family-gang-shop-robbery-rules'].description);
        }

        // Render Gang Auction Car Rules
        if (this.rulesData['gang-auction-car-rules']) {
            const gangAuctionCarContainer = document.getElementById('gang-auction-car-rules-container');
            const gangAuctionCarCount = document.getElementById('gang-auction-car-count');
            if (gangAuctionCarContainer) {
                const rulesHtml = this.generateRulesHTML(this.rulesData['gang-auction-car-rules'], 'gang-auction-car');
                gangAuctionCarContainer.innerHTML = rulesHtml;
            }
            if (gangAuctionCarCount) {
                gangAuctionCarCount.textContent = `${this.rulesData['gang-auction-car-rules'].rules.length} กฎ`;
            }            // Update subtitle with description
            this.updateRulesSubtitle('gang-auction-car-rules', this.rulesData['gang-auction-car-rules'].description);
        }

        // Render Family Auction Car Rules
        if (this.rulesData['family-auction-car-rules']) {
            const familyAuctionCarContainer = document.getElementById('family-auction-car-rules-container');
            const familyAuctionCarCount = document.getElementById('family-auction-car-count');
            if (familyAuctionCarContainer) {
                const rulesHtml = this.generateRulesHTML(this.rulesData['family-auction-car-rules'], 'family-auction-car');
                familyAuctionCarContainer.innerHTML = rulesHtml;
            }
            if (familyAuctionCarCount) {
                familyAuctionCarCount.textContent = `${this.rulesData['family-auction-car-rules'].rules.length} กฎ`;
            }            // Update subtitle with description
            this.updateRulesSubtitle('family-auction-car-rules', this.rulesData['family-auction-car-rules'].description);
        }

        // Render License Revocation Rules
        if (this.rulesData['license-revocation-rules']) {
            const licenseRevocationContainer = document.getElementById('license-revocation-rules-container');
            const licenseRevocationCount = document.getElementById('license-revocation-count');
            if (licenseRevocationContainer) {
                const rulesHtml = this.generateRulesHTML(this.rulesData['license-revocation-rules'], 'license-revocation');
                licenseRevocationContainer.innerHTML = rulesHtml;
            }
            if (licenseRevocationCount) {
                licenseRevocationCount.textContent = `${this.rulesData['license-revocation-rules'].rules.length} กฎ`;
            }
            // Update subtitle with description
            this.updateRulesSubtitle('license-revocation-rules', this.rulesData['license-revocation-rules'].description);
        }
        
        // Initialize collapsible functionality
        this.initializeCollapsible();
    }    hideDisabledNavigationLinks() {
        if (!this.visibilityConfig || !this.visibilityConfig.settings.enableVisibilityControl) {
            console.log('Visibility control disabled or no config found');
            return;
        }

        console.log('Hiding disabled navigation links...');
        console.log('Visibility config:', this.visibilityConfig.rulesVisibility);
        
        const rulesVisibility = this.visibilityConfig.rulesVisibility;
        
        // ซ่อน navigation links ที่ปิดการแสดงผล
        Object.keys(rulesVisibility).forEach(ruleKey => {
            const ruleConfig = rulesVisibility[ruleKey];
            const navLink = document.querySelector(`a[href="#${ruleKey}"]`);
            
            console.log(`Checking rule: ${ruleKey}, enabled: ${ruleConfig.enabled}, navLink found: ${!!navLink}`);
            
            if (navLink) {
                if (ruleConfig.enabled) {
                    navLink.style.display = 'flex'; // แสดง
                    console.log(`✅ Showing navigation link: ${ruleKey}`);
                } else {
                    navLink.style.display = 'none'; // ซ่อน
                    console.log(`❌ Hiding navigation link: ${ruleKey}`);
                }
            } else {
                console.warn(`⚠️ Navigation link not found for: ${ruleKey}`);
            }
        });

        // ซ่อนหมวดหมู่ที่ไม่มีกฎแสดง
        this.hideEmptyCategories();
    }

    hideEmptyCategories() {
        if (!this.visibilityConfig || !this.visibilityConfig.settings.hideEmptyCategories) {
            return;
        }

        console.log('Checking for empty categories...');
        const categoryGroups = document.querySelectorAll('.category-group');
        
        categoryGroups.forEach(categoryGroup => {
            const categoryContent = categoryGroup.querySelector('.category-content');
            if (categoryContent) {
                // หาลิงก์ที่แสดงอยู่ในหมวดนี้
                const visibleLinks = categoryContent.querySelectorAll('a[style*="display: flex"], a:not([style*="display: none"])');
                
                if (visibleLinks.length === 0) {
                    // หากไม่มีลิงก์ที่แสดงในหมวดนี้ ให้ซ่อนทั้งหมวด
                    categoryGroup.style.display = 'none';
                    console.log(`Hiding empty category group`);
                } else {
                    categoryGroup.style.display = 'block';
                    console.log(`Showing category group with ${visibleLinks.length} visible links`);
                }
            }
        });
    }

    hideDisabledSections() {
        if (!this.visibilityConfig || !this.visibilityConfig.settings.enableVisibilityControl) {
            return;
        }

        const allRuleKeys = Object.keys(this.visibilityConfig.rulesVisibility);
        
        allRuleKeys.forEach(ruleKey => {
            const ruleConfig = this.visibilityConfig.rulesVisibility[ruleKey];
            const section = document.getElementById(ruleKey);
            
            if (section) {
                if (ruleConfig.enabled) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                    console.log(`Hidden section: ${ruleKey}`);
                }
            }
        });
    }

    generateRulesHTML(rulesSection, theme = 'default') {
        if (!rulesSection || !rulesSection.rules) {
            return '<div class="rules-error-v2"><div class="error-icon-v2"><i class="fas fa-exclamation-triangle"></i></div><p class="error-title-v2">ไม่พบข้อมูลกฎ</p><p class="error-description-v2">กรุณาลองโหลดหน้าใหม่อีกครั้ง</p></div>';
        }

        const rulesList = rulesSection.rules.map((rule, index) => {
            if (!rule || !rule.text) return '';            const ruleNumber = index + 1;
            const hasSubRules = rule.subRules && rule.subRules.length > 0;
            const hasPenalty = rule.penalty;
            const hasDescription = rule.description;
            
            // ตรวจสอบความยาวของข้อความเพื่อตัดสินใจว่าจะแยก penalty หรือไม่
            const isLongText = rule.text && rule.text.length > 80;
            const shouldSeparatePenalty = isLongText && hasPenalty;
            
            // Generate penalty badges - แยกตามกรณี
            let penaltyText = '';
            let separatePenaltyHtml = '';
            
            if (hasPenalty) {
                const penaltyBadges = this.generatePenaltyBadges(rule.penalty);
                if (shouldSeparatePenalty) {
                    // แยก penalty ออกมาด้านล่าง
                    separatePenaltyHtml = `
                        <div class="rule-penalties-separate">
                            <span class="penalty-label">โทษที่ได้รับ:</span>
                            ${penaltyBadges}
                        </div>
                    `;
                } else {
                    // ใส่ penalty ติดกับข้อความ
                    penaltyText = ` ${penaltyBadges}`;
                }
            }
            
            // Generate badge HTML - for other badges only
            let badgeHtml = '';
            if (!hasPenalty) {
                if (rule.severity === 'high') {
                    badgeHtml = '<span class="rule-badge-v2 warning-badge">สำคัญ</span>';
                } else if (hasSubRules) {
                    badgeHtml = '<span class="rule-badge-v2 info-badge">รายละเอียด</span>';
                }
            }              // Generate description HTML - แยกตามกรณี
            let descriptionHtml = '';
            let separateDescriptionHtml = '';
              if (hasDescription) {
                const descHtml = `<p class="rule-description-v2">${rule.description}</p>`;
                const separateDescHtml = `<p class="rule-description-v2 separate-description">${rule.description}</p>`;
                if (shouldSeparatePenalty) {
                    // ถ้าแยก penalty แล้ว ให้ description อยู่ด้านล่าง penalty เท่านั้น
                    separateDescriptionHtml = separateDescHtml;
                    // ไม่ใส่ใน descriptionHtml เพื่อไม่ให้ซ้ำ
                } else {
                    // ถ้าไม่แยก penalty ให้ description อยู่ตำแหน่งเดิม
                    descriptionHtml = descHtml;
                }
            }
              // Generate sub-rules HTML
            let subRulesHtml = '';
            if (hasSubRules) {
                const subRulesList = rule.subRules.map(subRule => {
                    if (!subRule || !subRule.text) return '';
                      // Sub-rule penalty badges
                    let subPenaltyBadges = '';
                    if (subRule.penalty) {
                        subPenaltyBadges = ` ${this.generatePenaltyBadges(subRule.penalty)}`;
                    }
                    
                    return `
                        <div class="sub-rule-v2">
                            <div class="sub-rule-title-v2">${subRule.text}${subPenaltyBadges}</div>
                            ${subRule.description ? `<div class="sub-rule-description-v2">${subRule.description}</div>` : ''}
                        </div>
                    `;
                }).join('');
                
                if (subRulesList) {
                    subRulesHtml = `<div class="sub-rules-v2">${subRulesList}</div>`;
                }
            }
            
            // Generate examples HTML
            let examplesHtml = '';
            if (rule.examples && rule.examples.length > 0) {
                const examplesList = rule.examples.map(example => {
                    const exampleClass = example.type === 'allowed' ? 'rule-example-allowed' : 'rule-example-forbidden';
                    const exampleIcon = example.type === 'allowed' ? '✅' : '✖';
                    
                    let exampleContent = `
                        <div class="rule-example ${exampleClass}">
                            <div class="example-title">${example.title}</div>
                            <div class="example-description">${example.description}</div>
                    `;
                    
                    if (example.penalty) {
                        exampleContent += `<div class="example-penalty">โทษที่ได้รับ: ${this.generatePenaltyBadges(example.penalty)}</div>`;
                    }
                    
                    if (example.note) {
                        exampleContent += `<div class="example-note"><strong>หมายเหตุ:</strong> ${example.note}</div>`;
                    }
                    
                    exampleContent += `</div>`;
                    return exampleContent;
                }).join('');
                  if (examplesList) {
                    examplesHtml = `<div class="rule-examples-container">${examplesList}</div>`;
                }
            }            // For roleplay, stream-snipe, server-country, twitter, robbery, summon-evidence, evidence-submission, and kidnapping rules, always show all content (no collapsing)
            // For new player rules, only show description and sub-rules if they exist
            const isRoleplayTheme = theme === 'roleplay';
            const isStreamSnipeTheme = theme === 'stream-snipe';
            const isServerCountryTheme = theme === 'server-country';
            const isTwitterTheme = theme === 'twitter';            const isRobberyTheme = theme === 'robbery';
            const isSummonEvidenceTheme = theme === 'summon-evidence';            const isEvidenceSubmissionTheme = theme === 'evidence-submission';            const isKidnappingTheme = theme === 'kidnapping';            const isAirdropTheme = theme === 'airdrop';            const isShopRobberyActivityTheme = theme === 'shop-robbery-activity';
            const isFamilyGangShopRobberyTheme = theme === 'family-gang-shop-robbery';            const isGangAuctionCarTheme = theme === 'gang-auction-car';
            const isFamilyAuctionCarTheme = theme === 'family-auction-car';
            const isLicenseRevocationTheme = theme === 'license-revocation';
            const isAlwaysExpanded = isRoleplayTheme || isStreamSnipeTheme || isServerCountryTheme || isTwitterTheme || isRobberyTheme || isSummonEvidenceTheme || isEvidenceSubmissionTheme || isKidnappingTheme || isAirdropTheme || isShopRobberyActivityTheme || isFamilyGangShopRobberyTheme || isGangAuctionCarTheme || isFamilyAuctionCarTheme || isLicenseRevocationTheme;
            const shouldShowContent = isAlwaysExpanded || hasDescription || hasSubRules || (rule.examples && rule.examples.length > 0);            const isExpandable = !isAlwaysExpanded && (hasDescription || hasSubRules || (rule.examples && rule.examples.length > 0));
            
            // สำหรับกรณีที่แยก penalty และ description แล้ว ให้แสดงเฉพาะ sub-rules และ examples
            const hasContentToShow = (shouldSeparatePenalty && hasDescription) ?
                (hasSubRules || (rule.examples && rule.examples.length > 0)) : 
                shouldShowContent;
              return `
                <li class="rule-item-v2 ${isAlwaysExpanded ? 'expanded' : ''}" data-rule-id="${ruleNumber}">
                    <div class="rule-header-v2" ${isExpandable ? 'onclick="toggleRule(this)"' : ''}>
                        <div class="rule-number-v2">${ruleNumber}</div>
                        <div class="rule-title-text-v2">${rule.text}${penaltyText}</div>
                        ${badgeHtml}
                        ${isExpandable ? '<i class="fas fa-chevron-down rule-expand-icon-v2"></i>' : ''}
                    </div>
                    ${separatePenaltyHtml}
                    ${separateDescriptionHtml}
                    ${hasContentToShow ? `
                        <div class="rule-content-v2" ${isAlwaysExpanded ? 'style="max-height: none;"' : ''}>
                            ${descriptionHtml}
                            ${subRulesHtml}
                            ${examplesHtml}
                        </div>
                    ` : ''}
                </li>
            `;
        }).filter(Boolean).join('');

        return `<div class="${theme}-theme"><ul class="rules-list-v2">${rulesList}</ul></div>`;
    }

    initializeCollapsible() {
        // This function will be called to initialize collapsible functionality
        // The toggleRule function will be defined globally
    }

    updateContactSection() {
        // Update contact section if needed
        const contactSection = document.querySelector('.bg-gradient-to-r.from-yellow-400.to-orange-500');
        if (contactSection && this.configData.contact) {
            // Update contact information
        }
    }    showErrorMessage() {        const containers = [
            'new-player-rules-container',
            'roleplay-rules-container',
            'stream-snipe-rules-container', 
            'server-country-rules-container',
            'twitter-rules-container',
            'robbery-rules-container',
            'summon-evidence-rules-container',
            'evidence-submission-rules-container',            'kidnapping-rules-container',
            'airdrop-rules-container',
            'shop-robbery-activity-rules-container',
            'family-gang-shop-robbery-rules-container',
            'gang-auction-car-rules-container',
            'family-auction-car-rules-container',
            'license-revocation-rules-container'
        ];
        
        const errorHtml = `
            <div class="rules-error-v2">
                <div class="error-icon-v2">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <p class="error-title-v2">เกิดข้อผิดพลาด</p>
                <p class="error-description-v2">ไม่สามารถโหลดข้อมูลกฎได้ กรุณาลองโหลดหน้าใหม่อีกครั้ง</p>
                <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    โหลดใหม่
                </button>
            </div>
        `;
        
        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = errorHtml;
            }
        });
    }

    updateRulesSubtitle(sectionId, description) {
        // Find the subtitle element for the specific section
        let subtitleElement = null;
        
        if (sectionId === 'new-player-rules') {
            // Find subtitle in new-player-rules section
            const section = document.getElementById('new-player-rules');
            if (section) {
                subtitleElement = section.querySelector('.rules-subtitle-v2');
            }        } else if (sectionId === 'roleplay-rules') {
            // Find subtitle in roleplay-rules section
            const section = document.getElementById('roleplay-rules');
            if (section) {
                subtitleElement = section.querySelector('.rules-subtitle-v2');
            }
        } else if (sectionId === 'stream-snipe-rules') {
            // Find subtitle in stream-snipe-rules section
            const section = document.getElementById('stream-snipe-rules');
            if (section) {
                subtitleElement = section.querySelector('.rules-subtitle-v2');
            }        } else if (sectionId === 'server-country-rules') {
            // Find subtitle in server-country-rules section
            const section = document.getElementById('server-country-rules');
            if (section) {
                subtitleElement = section.querySelector('.rules-subtitle-v2');
            }        } else if (sectionId === 'twitter-rules') {
            // Find subtitle in twitter-rules section
            const section = document.getElementById('twitter-rules');
            if (section) {
                subtitleElement = section.querySelector('.rules-subtitle-v2');
            }        } else if (sectionId === 'robbery-rules') {
            // Find subtitle in robbery-rules section
            const section = document.getElementById('robbery-rules');
            if (section) {
                subtitleElement = section.querySelector('.rules-subtitle-v2');
            }        } else if (sectionId === 'summon-evidence-rules') {
            // Find subtitle in summon-evidence-rules section
            const section = document.getElementById('summon-evidence-rules');
            if (section) {
                subtitleElement = section.querySelector('.rules-subtitle-v2');
            }
        } else if (sectionId === 'evidence-submission-rules') {
            // Find subtitle in evidence-submission-rules section
            const section = document.getElementById('evidence-submission-rules');
            if (section) {
                subtitleElement = section.querySelector('.rules-subtitle-v2');
            }
        } else if (sectionId === 'kidnapping-rules') {
            // Find subtitle in kidnapping-rules section
            const section = document.getElementById('kidnapping-rules');
            if (section) {
                subtitleElement = section.querySelector('.rules-subtitle-v2');
            }        } else if (sectionId === 'shop-robbery-activity-rules') {
            // Find subtitle in shop-robbery-activity-rules section
            const section = document.getElementById('shop-robbery-activity-rules');            if (section) {
                subtitleElement = section.querySelector('.rules-subtitle-v2');
            }        } else if (sectionId === 'airdrop-rules') {
            // Find subtitle in airdrop-rules section
            const section = document.getElementById('airdrop-rules');
            if (section) {
                subtitleElement = section.querySelector('.rules-subtitle-v2');
            }        } else if (sectionId === 'family-gang-shop-robbery-rules') {
            // Find subtitle in family-gang-shop-robbery-rules section
            const section = document.getElementById('family-gang-shop-robbery-rules');
            if (section) {
                subtitleElement = section.querySelector('.rules-subtitle-v2');
            }
        } else if (sectionId === 'gang-auction-car-rules') {
            // Find subtitle in gang-auction-car-rules section
            const section = document.getElementById('gang-auction-car-rules');
            if (section) {
                subtitleElement = section.querySelector('.rules-subtitle-v2');
            }
        } else if (sectionId === 'family-auction-car-rules') {
            // Find subtitle in family-auction-car-rules section
            const section = document.getElementById('family-auction-car-rules');
            if (section) {
                subtitleElement = section.querySelector('.rules-subtitle-v2');
            }
        } else if (sectionId === 'license-revocation-rules') {
            // Find subtitle in license-revocation-rules section
            const section = document.getElementById('license-revocation-rules');
            if (section) {
                subtitleElement = section.querySelector('.rules-subtitle-v2');
            }
        }
        
        // Update the subtitle with description if both exist
        if (subtitleElement && description) {
            subtitleElement.textContent = description;
        }}

    // Fallback methods
    async loadFallbackRulesData() {
        const possiblePaths = [
            './data/rules.json',
            'data/rules.json',
            '../data/rules.json',
            './src/data/rules.json',
            'src/data/rules.json'
        ];
        
        let response;
        let lastError;
        
        for (const path of possiblePaths) {
            try {
                response = await fetch(path);
                if (response.ok) {
                    this.rulesData = await response.json();
                    console.log('Successfully loaded fallback rules from:', path);
                    return;
                }
            } catch (error) {
                lastError = error;
                console.warn(`Failed to load fallback rules from ${path}:`, error);
            }
        }
        
        throw new Error(`Failed to load fallback rules from any path. Last error: ${lastError?.message}`);
    }

    renderFallbackRules() {
        if (!this.rulesData) return;

        // Update page title
        document.title = this.rulesData.pageInfo?.pageTitle || 'กฎ | Fam Unity';
        
        // Update hero section
        this.updateFallbackHeroSection();
        
        // Update navigation
        this.updateFallbackNavigation();
        
        // Render rules content
        this.renderFallbackRulesContent();
    }

    updateFallbackHeroSection() {
        const heroTitle = document.querySelector('h1');
        const heroSubtitle = document.querySelector('h2');
        const heroDescription = document.querySelector('.text-lg.text-gray-600');

        if (heroTitle && this.rulesData.pageInfo?.heroTitle) {
            heroTitle.textContent = this.rulesData.pageInfo.heroTitle;
        }
        if (heroSubtitle && this.rulesData.pageInfo?.heroSubtitle) {
            heroSubtitle.textContent = this.rulesData.pageInfo.heroSubtitle;
        }
        if (heroDescription && this.rulesData.pageInfo?.heroDescription) {
            heroDescription.textContent = this.rulesData.pageInfo.heroDescription;
        }
    }    updateFallbackNavigation() {
        // Navigation updates handled by sidebar only - Quick Navigation removed
    }

    renderFallbackRulesContent() {
        // Render rules using the old structure
        const newPlayerContainer = document.getElementById('new-player-rules-container');
        const roleplayContainer = document.getElementById('roleplay-rules-container');
        
        if (newPlayerContainer && this.rulesData.newPlayerRules) {
            const rulesHtml = this.generateRulesHTML(this.rulesData.newPlayerRules, 'new-player');
            newPlayerContainer.innerHTML = rulesHtml;
        }
        
        if (roleplayContainer && this.rulesData.roleplayRules) {
            const rulesHtml = this.generateRulesHTML(this.rulesData.roleplayRules, 'roleplay');
            roleplayContainer.innerHTML = rulesHtml;
        }
        
        // Initialize collapsible functionality
        this.initializeCollapsible();
    }    generatePenaltyBadges(penaltyText) {
        if (!penaltyText) return '';
        
        // Handle "no penalty" case
        if (penaltyText.includes('ไม่มีโทษ') || penaltyText.includes('ไม่ได้รับโทษ')) {
            return `<div class="penalty-badges-container"><span class="penalty-badge no-penalty"><i class="fas fa-check-circle mr-1"></i>ไม่มีโทษ</span></div>`;
        }
        
        // Split penalties by comma and clean up
        const penalties = penaltyText.split(',').map(p => p.trim());
        
        const badges = penalties.map(penalty => {
            // Remove emoji and get clean text
            const cleanPenalty = penalty.replace(/🟨|🟧|🟥|💵/g, '').trim();
            
            // Determine badge type and icon
            let badgeClass = '';
            let icon = '';
            
            if (penalty.includes('🟨') || penalty.includes('ใบเหลือง')) {
                badgeClass = 'yellow-card';
                icon = '<i class="fas fa-square text-yellow-500 mr-1"></i>';
            } else if (penalty.includes('🟧') || penalty.includes('ใบส้ม')) {
                badgeClass = 'orange-card';
                icon = '<i class="fas fa-square text-orange-500 mr-1"></i>';
            } else if (penalty.includes('🟥') || penalty.includes('ใบแดง')) {
                badgeClass = 'red-card';
                icon = '<i class="fas fa-square text-red-500 mr-1"></i>';
            } else if (penalty.includes('💵') || penalty.includes('ปรับเงิน')) {
                badgeClass = 'fine';
                icon = '<i class="fas fa-coins mr-1"></i>';
            } else if (penalty.includes('แบนถาวร')) {
                badgeClass = 'permanent-ban';
                icon = '<i class="fas fa-ban mr-1"></i>';
            } else if (penalty.includes('แบน')) {
                badgeClass = 'ban';
                icon = '<i class="fas fa-user-slash mr-1"></i>';
            } else {
                // Default penalty
                badgeClass = 'penalty-text-badge';
                icon = '<i class="fas fa-gavel mr-1"></i>';
                return `<span class="rule-badge-v2 ${badgeClass}">${icon}${cleanPenalty}</span>`;
            }
            
            return `<span class="penalty-badge ${badgeClass}">${icon}${cleanPenalty}</span>`;
        });
        
        return `<div class="penalty-badges-container">${badges.join('')}</div>`;
    }
}

// Global function for toggling rules
function toggleRule(element) {
    const ruleItem = element.parentNode;
    const content = ruleItem.querySelector('.rule-content-v2');
    const icon = element.querySelector('.rule-expand-icon-v2');
    
    if (content && icon) {
        ruleItem.classList.toggle('expanded');
        
        if (ruleItem.classList.contains('expanded')) {
            content.style.maxHeight = content.scrollHeight + 'px';
        } else {
            content.style.maxHeight = '0';
        }
    }
}

// Global function for toggling categories
function toggleCategory(categoryId) {
    const categoryGroup = document.querySelector(`#${categoryId}`).closest('.category-group');
    const content = document.getElementById(categoryId);
    const icon = categoryGroup.querySelector('.toggle-icon');
    
    if (content && icon && categoryGroup) {
        // Toggle expanded class
        const isExpanded = content.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse
            content.classList.remove('expanded');
            categoryGroup.classList.remove('expanded');
            icon.style.transform = 'rotate(0deg)';
        } else {
            // Expand
            content.classList.add('expanded');
            categoryGroup.classList.add('expanded');
            icon.style.transform = 'rotate(180deg)';
        }
    }
}

// Mark active navigation links
function updateActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Remove all active classes
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Find current section
    let currentSection = '';
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) {
            currentSection = section.id;
        }
    });
    
    // Add active class to corresponding nav link
    if (currentSection) {
        const activeLink = document.querySelector(`a[href="#${currentSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Add scroll listener for active navigation
window.addEventListener('scroll', updateActiveNavLinks);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RulesLoader();
});
