import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule,CommonModule],
  template: `
    <h1>Threat Detection</h1>
    <div *ngIf="error" style="color: red">{{ error }}</div>
    <div>
      <h2>Threats</h2>
      <ul>
        <li *ngFor="let threat of threats">{{ threat.ip }} - {{ threat.event }} ({{ threat.timestamp }})</li>
      </ul>
      <input #threatIp placeholder="IP" />
      <input #threatEvent placeholder="Event" />
      <button (click)="addThreat(threatIp.value, threatEvent.value); threatIp.value=''; threatEvent.value=''">Add Threat</button>
    </div>
    <div>
      <h2>Rules</h2>
      <ul>
        <li *ngFor="let rule of rules">{{ rule.condition }}</li>
      </ul>
      <input #ruleCondition placeholder="Condition (e.g., ip starts with 192)" />
      <button (click)="addRule(ruleCondition.value); ruleCondition.value=''">Add Rule</button>
    </div>
    <div>
      <h2>Alerts</h2>
      <ul>
        <li *ngFor="let alert of alerts">{{ alert.message }}</li>
      </ul>
    </div>
  `,
  styles: [`
    h1, h2 { font-family: Arial, sans-serif; }
    div { margin: 20px; }
    ul { list-style-type: none; }
    input { margin-right: 10px; padding: 5px; }
    button { padding: 5px 10px; }
  `]
})
export class AppComponent implements OnInit {
  threats: any[] = [];
  rules: any[] = [];
  alerts: any[] = [];
  error: string = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.refresh(); // Initial load
    setInterval(() => this.refresh(), 2000); // Poll every 2s
  }

  addThreat(ip: string, event: string) {
    if (!ip || !event) {
      this.error = 'IP and Event are required';
      return;
    }
    const threat = { id: Date.now().toString(), timestamp: new Date().toISOString(), ip, event };
    this.api.addThreat(threat).subscribe({
      next: () => this.refresh(),
      error: (err) => this.error = `Failed to add threat: ${err.message}`
    });
  }

  addRule(condition: string) {
    if (!condition) {
      this.error = 'Condition is required';
      return;
    }
    const rule = { id: Date.now().toString(), condition };
    this.api.addRule(rule).subscribe({
      next: () => this.refresh(),
      error: (err) => this.error = `Failed to add rule: ${err.message}`
    });
  }

  refresh() {
    this.api.getThreats().subscribe({
      next: (data) => this.threats = data || [],
      error: (err) => this.error = `Failed to load threats: ${err.message}`
    });
    this.api.getRules().subscribe({
      next: (data) => this.rules = data || [],
      error: (err) => this.error = `Failed to load rules: ${err.message}`
    });
    this.api.getAlerts().subscribe({
      next: (data) => this.alerts = data || [],
      error: (err) => this.error = `Failed to load alerts: ${err.message}`
    });
  }
}