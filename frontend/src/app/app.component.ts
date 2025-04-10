import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  threats: any[] = [];
  rules: any[] = [];
  alerts: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getThreats().subscribe(data => this.threats = data);
    this.api.getRules().subscribe(data => this.rules = data);
    this.api.getAlerts().subscribe(data => this.alerts = data);
    setInterval(() => this.refresh(), 2000); // Poll every 2s
  }

  addThreat(ip: string, event: string) {
    const threat = { id: Date.now().toString(), timestamp: new Date().toISOString(), ip, event };
    this.api.addThreat(threat).subscribe(() => this.refresh());
  }

  addRule(condition: string) {
    const rule = { id: Date.now().toString(), condition };
    this.api.addRule(rule).subscribe(() => this.refresh());
  }

  refresh() {
    this.api.getThreats().subscribe(data => this.threats = data);
    this.api.getAlerts().subscribe(data => this.alerts = data);
  }
}