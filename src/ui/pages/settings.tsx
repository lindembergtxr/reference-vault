import { HealthReport } from '../features/report/healthReport'
import { TabRoot, TabList, TabItem, TabPanel } from '../components/index'
import { SettingsWorkspaceList } from '../features/settings/settingsWorkspaceList'

export const SettingsPage = () => {
    return (
        <div className="flex flex-col gap-4 w-full h-full">
            <TabRoot defaultSelectedKey="settings-tab-workspaces">
                <TabList id="settings-tabs">
                    <TabItem id="settings-tab-workspaces">Workspaces</TabItem>

                    <TabItem id="settings-tab-report">Report</TabItem>
                </TabList>

                <TabPanel id="settings-tab-workspaces">
                    <SettingsWorkspaceList />
                </TabPanel>

                <TabPanel id="settings-tab-report">
                    <HealthReport />
                </TabPanel>
            </TabRoot>
        </div>
    )
}
