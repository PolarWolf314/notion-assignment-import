import { EmojiRequest, TimeZoneRequest } from '../api-handlers/notion';
import CONFIGURATION from './configuration';

import { ModifyDeep } from '../types/utils';

type NeverEmpty<T extends string> = T extends '' ? never : T;
type NullIfEmpty<T extends string | null> = (T extends '' ? null : T) | null;

// TODO: enforce null if empty on save

interface RequiredFields {
	'canvas.classNames.breadcrumbs': NeverEmpty<string>;
	'canvas.classNames.assignment': NeverEmpty<string>;
	'canvas.classNames.title': NeverEmpty<string>;
	'canvas.classNames.availableDate': NeverEmpty<string>;
	'canvas.classNames.availableStatus': NeverEmpty<string>;
	'canvas.classNames.dueDate': NeverEmpty<string>;
	'canvas.classNames.dateElement': NeverEmpty<string>;
	'canvas.classValues.courseCodeN': NeverEmpty<string>,
	'canvas.classValues.notAvailable': NeverEmpty<string>;
	// initialised to null, but can never be cleared once set
	'notion.notionKey': NullIfEmpty<string>;
	'notion.databaseId': NullIfEmpty<string>;
}

interface OptionalFields {
	// TODO: validate before save
	'timeZone': NullIfEmpty<NonNullable<TimeZoneRequest>>;
	'canvas.courseCodeOverrides': NullIfEmpty<string>;
	'notion.propertyNames.name': NullIfEmpty<string>;
	'notion.propertyNames.category': NullIfEmpty<string>;
	'notion.propertyNames.course': NullIfEmpty<string>;
	'notion.propertyNames.url': NullIfEmpty<string>;
	'notion.propertyNames.status': NullIfEmpty<string>;
	'notion.propertyNames.available': NullIfEmpty<string>;
	'notion.propertyNames.due': NullIfEmpty<string>;
	'notion.propertyNames.span': NullIfEmpty<string>;
	'notion.propertyValues.categoryCanvas': NullIfEmpty<string>;
	'notion.propertyValues.statusToDo': NullIfEmpty<string>;
	'notion.courseEmojis': NullIfEmpty<string>;
}

export type SavedFields = RequiredFields & OptionalFields;

export type SavedOptions = {
	timeZone: OptionalFields['timeZone'];
	canvas: {
		classNames: {
			breadcrumbs: RequiredFields['canvas.classNames.breadcrumbs'];
			assignment: RequiredFields['canvas.classNames.assignment'];
			title: RequiredFields['canvas.classNames.title'];
			availableDate: RequiredFields['canvas.classNames.availableDate'];
			availableStatus: RequiredFields['canvas.classNames.availableStatus'];
			dueDate: RequiredFields['canvas.classNames.dueDate'];
			dateElement: RequiredFields['canvas.classNames.dateElement'];
		},
		classValues: {
			courseCodeN: RequiredFields['canvas.classValues.courseCodeN'];
			notAvailable: RequiredFields['canvas.classValues.notAvailable'];
		},
		courseCodeOverrides: OptionalFields['canvas.courseCodeOverrides'];
	},
	notion: {
		notionKey: RequiredFields['notion.notionKey'];
		databaseId: RequiredFields['notion.databaseId'];
		propertyNames: {
			name: OptionalFields['notion.propertyNames.name'];
			category: OptionalFields['notion.propertyNames.category'];
			course: OptionalFields['notion.propertyNames.course'];
			url: OptionalFields['notion.propertyNames.url'];
			status: OptionalFields['notion.propertyNames.status'];
			available: OptionalFields['notion.propertyNames.available'];
			due: OptionalFields['notion.propertyNames.due'];
			span: OptionalFields['notion.propertyNames.span'];
		},
		propertyValues: {
			categoryCanvas: OptionalFields['notion.propertyValues.categoryCanvas'];
			statusToDo: OptionalFields['notion.propertyValues.statusToDo'];
		},
		courseEmojis: OptionalFields['notion.courseEmojis'];
	},
};

export type Options = ModifyDeep<SavedOptions, {
	canvas: {
		timeZone: OptionalFields['timeZone'];
		classValues: {
			// TODO: validate before save
			courseCodeN: number;
		};
		selectors: {
			courseCode: NeverEmpty<string>;
			availableStatus: NeverEmpty<string>;
			availableDate: NeverEmpty<string>;
			dueDate: NeverEmpty<string>;
		};
		courseCodeOverrides: Record<string, string>;
	};
	notion: {
		timeZone: OptionalFields['timeZone'];
		// TODO: validate before save
		courseEmojis: Record<string, EmojiRequest>;
	};
}>;

// TODO

/* function flattenOptions(options): Record<string, string | number | null> {

}

export async function getOptionsFromStorage(): Promise<Options> {
	await chrome.storage.local.get({
		breadcrumbs: 'ic-app-crumbs',
		courseCodeN: 2,
		canvasAssignment: 'assignment',
		assignmentTitle: 'ig-title',
		availableDate: 'assignment-date-available',
		availableStatus: 'status-description',
		dueDate: 'assignment-date-due',
		dateElement: 'screenreader-only',
		notAvailableStatus: 'Not available until',
		notionKey: null,
		databaseId: null,
		timezone: 'Pacific/Auckland',
		toDoName: 'Name',
		toDoCategory: 'Category',
		toDoCourse: 'Course',
		toDoURL: 'URL',
		toDoStatus: 'Status',
		toDoAvailable: 'Reminder',
		toDoDue: 'Due',
		toDoSpan: 'Date Span',
		categoryCanvas: 'Canvas',
		statusToDo: 'To Do',
		courseCodeOverrides: '{}',
		courseEmojis: '{}',
	});
} */

// TODO: type known ids like in ../popup/popup.ts

function queryId(id: string): NullIfEmpty<string> | void {
	const element = document.getElementById(id);

	if (element && (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) return element.value || null;
}

function setValueById(id: string, value: string): void {
	const element = document.getElementById(id);

	if (element && (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) element.value = value;
}

async function restoreOptions() {
	const options = await chrome.storage.local.get({
		'timeZone': 'Pacific/Auckland',
		'canvas.classNames.breadcrumbs': 'ic-app-crumbs',
		'canvas.classNames.assignment': 'assignment',
		'canvas.classNames.title': 'ig-title',
		'canvas.classNames.availableDate': 'assignment-date-available',
		'canvas.classNames.availableStatus': 'status-description',
		'canvas.classNames.dueDate': 'assignment-date-due',
		'canvas.classNames.dateElement': 'screenreader-only',
		'canvas.classValues.courseCodeN': 2,
		'canvas.classValues.notAvailable': 'Not available until',
		'canvas.courseCodeOverrides': '{}',
		'notion.notionKey': null,
		'notion.databaseId': null,
		'notion.propertyNames.name': 'Name',
		'notion.propertyNames.category': 'Category',
		'notion.propertyNames.course': 'Course',
		'notion.propertyNames.url': 'URL',
		'notion.propertyNames.status': 'Status',
		'notion.propertyNames.available': 'Reminder',
		'notion.propertyNames.due': 'Due',
		'notion.propertyNames.span': 'Date Span',
		'notion.propertyValues.categoryCanvas': 'Canvas',
		'notion.propertyValues.statusToDo': 'To Do',
		'notion.courseEmojis': '{}',
	});

	// TODO: fix this 💩 temp fix 😃

	const _temp = {
		'timezone': options['timeZone'],
		'breadcrumbs': options['canvas.classNames.breadcrumbs'],
		'assignment-class': options['canvas.classNames.assignment'],
		'assignment-title': options['canvas.classNames.title'],
		'available-date': options['canvas.classNames.availableDate'],
		'available-status': options['canvas.classNames.availableStatus'],
		'due-date': options['canvas.classNames.dueDate'],
		'date-element': options['canvas.classNames.dateElement'],
		'course-code-n': options['canvas.classValues.courseCodeN'],
		'status-not-available': options['canvas.classValues.notAvailable'],
		'course-code-overrides': options['canvas.courseCodeOverrides'],
		'notion-key': options['notion.notionKey'],
		'database-id': options['notion.databaseId'],
		'notion-property-name': options['notion.propertyNames.name'],
		'notion-property-category': options['notion.propertyNames.category'],
		'notion-property-course': options['notion.propertyNames.course'],
		'notion-property-url': options['notion.propertyNames.url'],
		'notion-property-status': options['notion.propertyNames.status'],
		'notion-property-available': options['notion.propertyNames.available'],
		'notion-property-due': options['notion.propertyNames.due'],
		'notion-property-span': options['notion.propertyNames.span'],
		'notion-category-canvas': options['notion.propertyValues.categoryCanvas'],
		'notion-status-todo': options['notion.propertyValues.statusToDo'],
		'course-emojis': options['notion.courseEmojis'],
	};
	Object.entries(_temp).forEach(([id, value]) => setValueById(id, value));
}

function verifyRequiredField(this: HTMLInputElement) {
	// TODO: make this more elegant
	if (saveButton) {
		if (Object.values(requiredFields).some(input => !input.value)) {
			saveButton.innerHTML = 'Missing required fields!';
			saveButton.classList.add('red');
			saveButton.classList.remove('green');
		}
		else {
			saveButton.innerHTML = 'Save';
			saveButton.classList.add('green');
			saveButton.classList.remove('red');
		}
	}

	if (!this.value) {
		this.classList.add('missing-required');
	}
	else {
		this.classList.remove('missing-required');
	}
}

function saveSuccess() {
	if (saveButton) {
		saveButton.innerHTML = 'Saved!';

		setTimeout(() => {
			saveButton.innerHTML = 'Save';
		}, 1325);
	}
}

async function saveOptions() {
	// check if any required fields are missing
	// TODO: make this more elegant
	if (saveButton) {
		if (Object.values(requiredFields).some(input => !input.value)) {
			saveButton.innerHTML = 'Missing required fields!';
			saveButton.classList.add('red');
			saveButton.classList.remove('green');
			return;
		}
		else {
			saveButton.innerHTML = 'Save';
			saveButton.classList.add('green');
			saveButton.classList.remove('red');
		}
	}

	saveSuccess();

	await chrome.storage.local.set({
		'timeZone': queryId('timezone'),
		'canvas.classNames.breadcrumbs': queryId('breadcrumbs'),
		'canvas.classNames.assignment': queryId('assignment-class'),
		'canvas.classNames.title': queryId('assignment-title'),
		'canvas.classNames.availableDate': queryId('available-date'),
		'canvas.classNames.availableStatus': queryId('available-status'),
		'canvas.classNames.dueDate': queryId('due-date'),
		'canvas.classNames.dateElement': queryId('date-element'),
		'canvas.classValues.courseCodeN': queryId('course-code-n'),
		'canvas.classValues.notAvailable': queryId('status-not-available'),
		'canvas.courseCodeOverrides': queryId('course-code-overrides'),
		'notion.notionKey': queryId('notion-key'),
		'notion.databaseId': queryId('database-id'),
		'notion.propertyNames.name': queryId('notion-property-name'),
		'notion.propertyNames.category': queryId('notion-property-category'),
		'notion.propertyNames.course': queryId('notion-property-course'),
		'notion.propertyNames.url': queryId('notion-property-url'),
		'notion.propertyNames.status': queryId('notion-property-status'),
		'notion.propertyNames.available': queryId('notion-property-available'),
		'notion.propertyNames.due': queryId('notion-property-due'),
		'notion.propertyNames.span': queryId('notion-property-span'),
		'notion.propertyValues.categoryCanvas': queryId('notion-category-canvas'),
		'notion.propertyValues.statusToDo': queryId('notion-status-todo'),
		'notion.courseEmojis': queryId('course-emojis'),
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions);

const requiredFields = (<NodeListOf<HTMLInputElement>>document.querySelectorAll('input[required]'));

requiredFields.forEach(element => element.addEventListener('input', verifyRequiredField));

const saveButton = document.getElementById('save-button');
if (saveButton) {
	saveButton.addEventListener('click', saveOptions);
}

document.addEventListener('keydown', keyEvent => {
	if (keyEvent.ctrlKey && keyEvent.key === 's') {
		keyEvent.preventDefault();
		saveOptions();
	}
});