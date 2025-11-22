function reportFailure(machineId) {
	document.getElementById('machineId').value = machineId;
	document.getElementById('failureModal').style.display = 'block';
}

document.querySelector('.close').onclick = function () {
	document.getElementById('failureModal').style.display = 'none';
}

window.onclick = function (event) {
	if (event.target == document.getElementById('failureModal')) {
		document.getElementById('failureModal').style.display = 'none';
	}
}

function filterFailures(status) {
	const failures = document.querySelectorAll('.failure');
	failures.forEach(failure => {
		if (status === 'all' || failure.classList.contains(status)) {
			failure.style.display = 'block';
		} else {
			failure.style.display = 'none';
		}
	});
}