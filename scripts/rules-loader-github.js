// Rules Loader for Fam Unity - GitHub Pages Static Version
class RulesLoader {
    constructor() {
        this.configData = null;
        this.rulesData = {};
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
            this.showErrorMessage();
        }
    }

    async loadConfigData() {
        try {
            const response = await fetch('https://trpxx.github.io/FamUnity-Rules/data/rules-config.json');
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
    }

    async loadAllRulesData() {
        console.log('Loading all rules data...');
        const ruleFiles = this.configData.ruleFiles || [
            "new-player-rules.json",
            "roleplay-rules.json", 
            "stream-snipe-rules.json",
            "server-country-rules.json"
        ];

        const loadPromises = ruleFiles.map(async (filename) => {
            const fullPath = `https://trpxx.github.io/FamUnity-Rules/data/${filename}`;
            return this.loadRuleFile(filename.replace('.json', ''), fullPath);
        });

        await Promise.allSettled(loadPromises);
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
    }

    showLoadingState() {
        const newPlayerContainer = document.getElementById('new-player-rules-container');
        const roleplayContainer = document.getElementById('roleplay-rules-container');
        const streamSnipeContainer = document.getElementById('stream-snipe-rules-container');
        const serverCountryContainer = document.getElementById('server-country-rules-container');

        const loadingHTML = `
            <div class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                <p class="text-gray-600">กำลังโหลดกฎ...</p>
            </div>
        `;

        if (newPlayerContainer) newPlayerContainer.innerHTML = loadingHTML;
        if (roleplayContainer) roleplayContainer.innerHTML = loadingHTML;
        if (streamSnipeContainer) streamSnipeContainer.innerHTML = loadingHTML;
        if (serverCountryContainer) serverCountryContainer.innerHTML = loadingHTML;
    }

    showErrorMessage() {
        const errorHTML = `
            <div class="text-center py-8">
                <div class="text-red-500 text-4xl mb-4">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">ไม่สามารถโหลดข้อมูลได้</h3>
                <p class="text-gray-600 mb-4">เกิดข้อผิดพลาดในการโหลดกฎ กรุณารีเฟรชหน้าเว็บ</p>
                <button onclick="window.location.reload()" class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors">
                    รีเฟรชหน้าเว็บ
                </button>
            </div>
        `;

        const containers = [
            'new-player-rules-container',
            'roleplay-rules-container', 
            'stream-snipe-rules-container',
            'server-country-rules-container'
        ];

        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = errorHTML;
            }
        });
    }

    renderRules() {
        console.log('Rendering rules with data:', this.rulesData);
        
        // Render each rule section
        this.renderRuleSection('new-player-rules', 'new-player-rules-container');
        this.renderRuleSection('roleplay-rules', 'roleplay-rules-container'); 
        this.renderRuleSection('stream-snipe-rules', 'stream-snipe-rules-container');
        this.renderRuleSection('server-country-rules', 'server-country-rules-container');
    }

    renderRuleSection(ruleId, containerId) {
        const container = document.getElementById(containerId);
        const ruleData = this.rulesData[ruleId];
        
        if (!container) {
            console.warn(`Container ${containerId} not found`);
            return;
        }

        if (!ruleData) {
            console.warn(`Rule data for ${ruleId} not found`);
            container.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-gray-600">ไม่พบข้อมูลกฎสำหรับหมวดนี้</p>
                </div>
            `;
            return;
        }

        let html = '';

        // Add description if available
        if (ruleData.description) {
            html += `
                <div class="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-yellow-500">
                    <p class="text-gray-700">${ruleData.description}</p>
                </div>
            `;
        }

        // Add rules
        if (ruleData.rules && ruleData.rules.length > 0) {
            html += '<div class="space-y-4">';
            
            ruleData.rules.forEach((rule, index) => {
                const ruleNumber = index + 1;
                html += `
                    <div class="rule-item bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div class="p-4">
                            <div class="flex items-start">
                                <div class="flex-shrink-0 w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">
                                    ${ruleNumber}
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-semibold text-gray-800 mb-2">${rule.title}</h4>
                                    <p class="text-gray-600 leading-relaxed">${rule.description}</p>
                                    ${rule.penalty ? `
                                        <div class="mt-3 p-3 bg-red-50 border-l-4 border-red-400 rounded">
                                            <p class="text-sm text-red-700">
                                                <i class="fas fa-exclamation-triangle mr-1"></i>
                                                <strong>โทษ:</strong> ${rule.penalty}
                                            </p>
                                        </div>
                                    ` : ''}
                                    ${rule.examples && rule.examples.length > 0 ? `
                                        <div class="mt-3">
                                            <h5 class="text-sm font-semibold text-gray-700 mb-2">ตอย่าง:</h5>
                                            <ul class="text-sm text-gray-600 space-y-1">
                                                ${rule.examples.map(example => `<li class="flex items-start"><i class="fas fa-chevron-right text-yellow-500 mr-2 mt-1 text-xs"></i><span>${example}</span></li>`).join('')}
                                            </ul>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        } else {
            html += `
                <div class="text-center py-8">
                    <p class="text-gray-600">ไม่มีกฎในหมวดนี้</p>
                </div>
            `;
        }

        container.innerHTML = html;
    }
}
